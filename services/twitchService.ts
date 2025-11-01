// Twitch Integration Service for MetaCity
import { EventEmitter } from "events";

export interface TwitchConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  message: string;
  timestamp: Date;
  badges: string[];
  color?: string;
  isSubscriber: boolean;
  isModerator: boolean;
  isVip: boolean;
  isBroadcaster: boolean;
}

export interface ChatCommand {
  command: string;
  args: string[];
  user: {
    id: string;
    username: string;
    displayName: string;
    isSubscriber: boolean;
    isModerator: boolean;
    isBroadcaster: boolean;
  };
  message: ChatMessage;
}

export interface StreamStats {
  viewerCount: number;
  isLive: boolean;
  title: string;
  gameName: string;
  startedAt?: Date;
  thumbnailUrl: string;
}

class TwitchService extends EventEmitter {
  private config: TwitchConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: TwitchUser | null = null;
  private chatWebSocket: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;

  constructor(config: TwitchConfig) {
    super();
    this.config = config;
    this.loadTokensFromStorage();
  }

  // Authentication Methods
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      state: Math.random().toString(36).substring(2),
    });
    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<boolean> {
    try {
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) throw new Error("Token exchange failed");

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      this.saveTokensToStorage();
      await this.fetchUserInfo();

      this.emit("authenticated", this.user);
      return true;
    } catch (error) {
      console.error("Token exchange error:", error);
      this.emit("authError", error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      this.accessToken = data.access_token;
      if (data.refresh_token) this.refreshToken = data.refresh_token;

      this.saveTokensToStorage();
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      return false;
    }
  }

  private async fetchUserInfo(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const response = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Client-Id": this.config.clientId,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await this.refreshAccessToken();
          return this.fetchUserInfo();
        }
        throw new Error("Failed to fetch user info");
      }

      const data = await response.json();
      this.user = data.data[0];
    } catch (error) {
      console.error("User info fetch error:", error);
    }
  }

  // Chat Connection Methods
  async connectToChat(): Promise<boolean> {
    if (!this.accessToken || !this.user) {
      console.error("Must be authenticated before connecting to chat");
      return false;
    }

    try {
      this.chatWebSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

      this.chatWebSocket.onopen = () => {
        this.chatWebSocket?.send(
          `CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands`
        );
        this.chatWebSocket?.send(`PASS oauth:${this.accessToken}`);
        this.chatWebSocket?.send(`NICK ${this.user!.login}`);
      };

      this.chatWebSocket.onmessage = (event) => {
        this.handleChatMessage(event.data);
      };

      this.chatWebSocket.onclose = () => {
        this.isConnected = false;
        this.emit("chatDisconnected");
        this.attemptReconnect();
      };

      this.chatWebSocket.onerror = (error) => {
        console.error("Chat WebSocket error:", error);
        this.emit("chatError", error);
      };

      return true;
    } catch (error) {
      console.error("Chat connection error:", error);
      return false;
    }
  }

  joinChannel(channelName: string): void {
    if (this.chatWebSocket && this.isConnected) {
      this.chatWebSocket.send(`JOIN #${channelName.toLowerCase()}`);
    }
  }

  leaveChannel(channelName: string): void {
    if (this.chatWebSocket && this.isConnected) {
      this.chatWebSocket.send(`PART #${channelName.toLowerCase()}`);
    }
  }

  sendChatMessage(channel: string, message: string): void {
    if (this.chatWebSocket && this.isConnected) {
      this.chatWebSocket.send(`PRIVMSG #${channel.toLowerCase()} :${message}`);
    }
  }

  private handleChatMessage(rawMessage: string): void {
    if (rawMessage.includes("PING")) {
      this.chatWebSocket?.send("PONG :tmi.twitch.tv");
      return;
    }

    if (rawMessage.includes("Welcome, GLHF!")) {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit("chatConnected");
      return;
    }

    // Parse chat messages
    const messageData = this.parseChatMessage(rawMessage);
    if (messageData) {
      this.emit("chatMessage", messageData);

      // Check for commands
      if (messageData.message.startsWith("!")) {
        const command = this.parseCommand(messageData);
        if (command) {
          this.emit("chatCommand", command);
        }
      }
    }
  }

  private parseChatMessage(rawMessage: string): ChatMessage | null {
    try {
      const parts = rawMessage.split(" ");
      if (parts[1] !== "PRIVMSG") return null;

      // Extract tags (user info)
      const tagsMatch = rawMessage.match(/^@([^\\s]+)/);
      const tags: Record<string, string> = {};

      if (tagsMatch) {
        const tagPairs = tagsMatch[1].split(";");
        tagPairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          tags[key] = value || "";
        });
      }

      // Extract message
      const messageStart =
        rawMessage.indexOf(":", rawMessage.indexOf("PRIVMSG")) + 1;
      const message = rawMessage.substring(messageStart);

      // Extract user info
      const userMatch = rawMessage.match(/:([^!]+)!/);
      const username = userMatch?.[1] || "";

      return {
        id: tags["id"] || Math.random().toString(),
        userId: tags["user-id"] || "",
        username,
        displayName: tags["display-name"] || username,
        message,
        timestamp: new Date(),
        badges: tags["badges"] ? tags["badges"].split(",") : [],
        color: tags["color"] || undefined,
        isSubscriber: tags["subscriber"] === "1",
        isModerator: tags["mod"] === "1",
        isVip: tags["vip"] === "1",
        isBroadcaster: tags["badges"]?.includes("broadcaster"),
      };
    } catch (error) {
      console.error("Error parsing chat message:", error);
      return null;
    }
  }

  private parseCommand(message: ChatMessage): ChatCommand | null {
    const parts = message.message.trim().split(" ");
    const command = parts[0].substring(1); // Remove !
    const args = parts.slice(1);

    return {
      command,
      args,
      user: {
        id: message.userId,
        username: message.username,
        displayName: message.displayName,
        isSubscriber: message.isSubscriber,
        isModerator: message.isModerator,
        isBroadcaster: message.isBroadcaster,
      },
      message,
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit("chatReconnectFailed");
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      this.connectToChat();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Stream Info Methods
  async getStreamInfo(username: string): Promise<StreamStats | null> {
    if (!this.accessToken) return null;

    try {
      const userResponse = await fetch(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Client-Id": this.config.clientId,
          },
        }
      );

      const userData = await userResponse.json();
      const userId = userData.data[0]?.id;

      if (!userId) return null;

      const streamResponse = await fetch(
        `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Client-Id": this.config.clientId,
          },
        }
      );

      const streamData = await streamResponse.json();
      const stream = streamData.data[0];

      return {
        viewerCount: stream?.viewer_count || 0,
        isLive: !!stream,
        title: stream?.title || "",
        gameName: stream?.game_name || "",
        startedAt: stream?.started_at ? new Date(stream.started_at) : undefined,
        thumbnailUrl: stream?.thumbnail_url || "",
      };
    } catch (error) {
      console.error("Stream info fetch error:", error);
      return null;
    }
  }

  // Storage Methods
  private saveTokensToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("twitch_access_token", this.accessToken || "");
      localStorage.setItem("twitch_refresh_token", this.refreshToken || "");
    }
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("twitch_access_token");
      this.refreshToken = localStorage.getItem("twitch_refresh_token");
    }
  }

  // Public Methods
  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }

  getUser(): TwitchUser | null {
    return this.user;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;

    if (this.chatWebSocket) {
      this.chatWebSocket.close();
      this.chatWebSocket = null;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("twitch_access_token");
      localStorage.removeItem("twitch_refresh_token");
    }

    this.emit("logout");
  }

  disconnect(): void {
    if (this.chatWebSocket) {
      this.chatWebSocket.close();
    }
  }
}

// Default configuration
export const defaultTwitchConfig: TwitchConfig = {
  clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
  clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
  redirectUri:
    process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI ||
    "http://localhost:3001/auth/twitch/callback",
  scopes: [
    "chat:read",
    "chat:edit",
    "channel:read:subscriptions",
    "user:read:email",
    "channel:moderate",
  ],
};

// Export singleton instance
let twitchService: TwitchService | null = null;

export const getTwitchService = (config?: TwitchConfig): TwitchService => {
  if (!twitchService) {
    twitchService = new TwitchService(config || defaultTwitchConfig);
  }
  return twitchService;
};

export default TwitchService;
