import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getTwitchService,
  TwitchUser,
  ChatMessage,
  ChatCommand,
  StreamStats,
} from "@/services/twitchService";
import { useNotifications } from "./NotificationContext";

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  username: string;
  vote: "yes" | "no";
  weight: number; // Subscriber/mod weight multiplier
  timestamp: Date;
}

export interface StreamProposal {
  id: string;
  title: string;
  description: string;
  type: "building" | "policy" | "upgrade" | "event";
  options: string[];
  votes: Vote[];
  isActive: boolean;
  startTime: Date;
  endTime: Date;
  createdBy: string;
}

export interface StreamReward {
  id: string;
  streamerId: string;
  streamerUsername: string;
  amount: number;
  type: "building_mint" | "proposal_reward" | "viewer_engagement";
  timestamp: Date;
  txHash?: string;
}

interface StreamingContextType {
  // Authentication
  isAuthenticated: boolean;
  user: TwitchUser | null;
  isConnected: boolean;

  // Stream State
  isStreaming: boolean;
  streamStats: StreamStats | null;
  viewerCount: number;

  // Chat
  chatMessages: ChatMessage[];
  recentCommands: ChatCommand[];

  // Voting
  activeProposals: StreamProposal[];
  votes: Vote[];

  // Rewards
  totalEarnings: number;
  recentRewards: StreamReward[];

  // Actions
  login: () => void;
  logout: () => void;
  startStream: () => void;
  stopStream: () => void;
  joinChat: (channel: string) => void;
  leaveChat: () => void;
  sendMessage: (message: string) => void;
  createProposal: (
    proposal: Omit<StreamProposal, "id" | "votes" | "startTime">
  ) => void;
  endProposal: (proposalId: string) => void;
  processVote: (command: ChatCommand) => void;
  claimRewards: () => void;
}

const StreamingContext = createContext<StreamingContextType | undefined>(
  undefined
);

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) {
    throw new Error("useStreaming must be used within a StreamingProvider");
  }
  return context;
};

interface StreamingProviderProps {
  children: React.ReactNode;
}

export const StreamingProvider: React.FC<StreamingProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TwitchUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStats, setStreamStats] = useState<StreamStats | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [recentCommands, setRecentCommands] = useState<ChatCommand[]>([]);
  const [activeProposals, setActiveProposals] = useState<StreamProposal[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [recentRewards, setRecentRewards] = useState<StreamReward[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);

  const { showToast, playSound, showBrowserNotification } = useNotifications();
  const twitchService = getTwitchService();

  // Initialize service event listeners
  useEffect(() => {
    const handleAuthenticated = (userData: TwitchUser) => {
      setIsAuthenticated(true);
      setUser(userData);
      showToast({
        type: "success",
        title: "🎮 Twitch Connected!",
        message: `Welcome ${userData.display_name}! Ready to stream MetaCity.`,
        duration: 4000,
      });
      playSound("success");
    };

    const handleChatConnected = () => {
      setIsConnected(true);
      showToast({
        type: "success",
        title: "💬 Chat Connected",
        message: "Connected to Twitch chat. Viewers can now vote!",
        duration: 3000,
      });
    };

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages((prev) => [...prev.slice(-99), message]); // Keep last 100 messages
    };

    const handleChatCommand = (command: ChatCommand) => {
      setRecentCommands((prev) => [...prev.slice(-19), command]); // Keep last 20 commands
      processCommand(command);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      showToast({
        type: "warning",
        title: "⚠️ Chat Disconnected",
        message: "Twitch chat connection lost. Attempting to reconnect...",
        duration: 5000,
      });
    };

    const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
      setIsConnected(false);
      setChatMessages([]);
      setRecentCommands([]);
      setActiveProposals([]);
      setVotes([]);
    };

    // Set up event listeners
    twitchService.on("authenticated", handleAuthenticated);
    twitchService.on("chatConnected", handleChatConnected);
    twitchService.on("chatMessage", handleChatMessage);
    twitchService.on("chatCommand", handleChatCommand);
    twitchService.on("chatDisconnected", handleDisconnected);
    twitchService.on("logout", handleLogout);

    // Check if already authenticated
    if (twitchService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(twitchService.getUser());
    }

    return () => {
      twitchService.removeAllListeners();
    };
  }, []);

  // Update stream stats periodically
  useEffect(() => {
    if (!isStreaming || !user) return;

    const updateStats = async () => {
      const stats = await twitchService.getStreamInfo(user.login);
      if (stats) {
        setStreamStats(stats);
        setViewerCount(stats.viewerCount);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isStreaming, user]);

  // Command processing
  const processCommand = useCallback(
    (command: ChatCommand) => {
      const { command: cmd, args, user: cmdUser } = command;

      switch (cmd.toLowerCase()) {
        case "vote":
          processVoteCommand(command);
          break;
        case "proposal":
          if (cmdUser.isBroadcaster || cmdUser.isModerator) {
            // Only broadcasters and mods can create proposals
            sendMessage(
              `@${cmdUser.username} Use the streamer dashboard to create proposals!`
            );
          }
          break;
        case "city":
          sendCityStats();
          break;
        case "help":
          sendHelpMessage();
          break;
        default:
          // Handle custom city commands
          if (["build", "upgrade", "demolish"].includes(cmd.toLowerCase())) {
            processCityCommand(command);
          }
      }
    },
    [activeProposals]
  );

  const processVoteCommand = (command: ChatCommand) => {
    const { args, user: cmdUser } = command;

    if (args.length < 2) {
      sendMessage(`@${cmdUser.username} Usage: !vote <proposal_id> <yes|no>`);
      return;
    }

    const [proposalId, voteChoice] = args;
    const proposal = activeProposals.find(
      (p) => p.id === proposalId && p.isActive
    );

    if (!proposal) {
      sendMessage(
        `@${cmdUser.username} No active proposal found with ID: ${proposalId}`
      );
      return;
    }

    if (!["yes", "no"].includes(voteChoice.toLowerCase())) {
      sendMessage(`@${cmdUser.username} Vote must be 'yes' or 'no'`);
      return;
    }

    // Calculate vote weight
    let weight = 1;
    if (cmdUser.isBroadcaster) weight = 10;
    else if (cmdUser.isModerator) weight = 5;
    else if (cmdUser.isSubscriber) weight = 2;

    // Check if user already voted
    const existingVote = votes.find(
      (v) => v.proposalId === proposalId && v.userId === cmdUser.id
    );
    if (existingVote) {
      sendMessage(`@${cmdUser.username} You already voted on this proposal!`);
      return;
    }

    const vote: Vote = {
      id: Math.random().toString(36).substr(2, 9),
      proposalId,
      userId: cmdUser.id,
      username: cmdUser.username,
      vote: voteChoice.toLowerCase() as "yes" | "no",
      weight,
      timestamp: new Date(),
    };

    setVotes((prev) => [...prev, vote]);

    playSound("vote");
    showToast({
      type: "info",
      title: "🗳️ Vote Recorded",
      message: `${
        cmdUser.displayName
      } voted ${voteChoice.toUpperCase()} (weight: ${weight})`,
      duration: 2000,
    });

    sendMessage(
      `@${
        cmdUser.username
      } Vote recorded! ${voteChoice.toUpperCase()} (weight: ${weight})`
    );
  };

  const processCityCommand = (command: ChatCommand) => {
    const { command: cmd, args, user: cmdUser } = command;

    // Only allow certain users to execute city commands
    if (
      !cmdUser.isBroadcaster &&
      !cmdUser.isModerator &&
      !cmdUser.isSubscriber
    ) {
      sendMessage(
        `@${cmdUser.username} Only subscribers can use city commands!`
      );
      return;
    }

    switch (cmd.toLowerCase()) {
      case "build":
        if (args.length < 1) {
          sendMessage(`@${cmdUser.username} Usage: !build <building_type>`);
          return;
        }
        // Trigger building action
        showToast({
          type: "info",
          title: "🏗️ Building Request",
          message: `${cmdUser.displayName} wants to build: ${args[0]}`,
          action: {
            label: "Approve",
            onClick: () => approveBuildingRequest(cmdUser.username, args[0]),
          },
        });
        break;
      case "upgrade":
        showToast({
          type: "info",
          title: "⬆️ Upgrade Request",
          message: `${cmdUser.displayName} suggests upgrading a building`,
          duration: 4000,
        });
        break;
    }
  };

  const approveBuildingRequest = (username: string, buildingType: string) => {
    // This would integrate with your building system
    const reward: StreamReward = {
      id: Math.random().toString(36).substr(2, 9),
      streamerId: user?.id || "",
      streamerUsername: user?.login || "",
      amount: 100, // 10% of 1000 token building reward
      type: "building_mint",
      timestamp: new Date(),
    };

    setRecentRewards((prev) => [...prev, reward]);
    setTotalEarnings((prev) => prev + reward.amount);

    playSound("mint");
    showToast({
      type: "success",
      title: "💰 Streamer Reward",
      message: `Earned ${reward.amount} MTC from ${username}'s building!`,
      duration: 4000,
    });

    sendMessage(
      `Building approved! ${username} built a ${buildingType}. Streamer earned ${reward.amount} MTC! 🎉`
    );
  };

  const sendCityStats = () => {
    const stats = `🏙️ MetaCity Stats: 8 buildings, 78% sustainability, Level 5, 12.5K MTC earned!`;
    sendMessage(stats);
  };

  const sendHelpMessage = () => {
    const help = `Commands: !vote <id> <yes/no> | !build <type> | !city | !help | Subs can use !build, !upgrade`;
    sendMessage(help);
  };

  // Public actions
  const login = useCallback(() => {
    const authUrl = twitchService.getAuthUrl();
    window.open(authUrl, "twitch_auth", "width=600,height=700");
  }, []);

  const logout = useCallback(() => {
    twitchService.logout();
  }, []);

  const startStream = useCallback(() => {
    setIsStreaming(true);
    showToast({
      type: "success",
      title: "🎥 Stream Started",
      message:
        "MetaCity stream is now live! Viewers can interact with your city.",
      duration: 5000,
    });
    showBrowserNotification("MetaCity Stream Live", {
      body: "Your MetaCity stream is now live!",
      icon: "/favicon.ico",
    });
  }, []);

  const stopStream = useCallback(() => {
    setIsStreaming(false);
    setStreamStats(null);
    setViewerCount(0);
    showToast({
      type: "info",
      title: "📴 Stream Ended",
      message: "MetaCity stream has ended. Thanks for streaming!",
      duration: 4000,
    });
  }, []);

  const joinChat = useCallback(
    async (channel: string) => {
      if (!isAuthenticated) {
        showToast({
          type: "error",
          title: "❌ Not Authenticated",
          message: "Please login to Twitch first!",
          duration: 3000,
        });
        return;
      }

      await twitchService.connectToChat();
      twitchService.joinChannel(channel);
      setCurrentChannel(channel);
    },
    [isAuthenticated]
  );

  const leaveChat = useCallback(() => {
    if (currentChannel) {
      twitchService.leaveChannel(currentChannel);
      setCurrentChannel(null);
      setIsConnected(false);
    }
  }, [currentChannel]);

  const sendMessage = useCallback(
    (message: string) => {
      if (currentChannel && isConnected) {
        twitchService.sendChatMessage(currentChannel, message);
      }
    },
    [currentChannel, isConnected]
  );

  const createProposal = useCallback(
    (proposalData: Omit<StreamProposal, "id" | "votes" | "startTime">) => {
      const proposal: StreamProposal = {
        ...proposalData,
        id: Math.random().toString(36).substr(2, 9),
        votes: [],
        isActive: true,
        startTime: new Date(),
      };

      setActiveProposals((prev) => [...prev, proposal]);

      playSound("notification");
      showToast({
        type: "info",
        title: "📋 New Proposal Created",
        message: `"${proposal.title}" - Viewers can vote with !vote ${proposal.id} yes/no`,
        duration: 6000,
      });

      sendMessage(
        `🗳️ NEW PROPOSAL: ${proposal.title} | Vote: !vote ${proposal.id} yes/no | Ends in 5 minutes!`
      );
    },
    []
  );

  const endProposal = useCallback(
    (proposalId: string) => {
      const proposal = activeProposals.find((p) => p.id === proposalId);
      if (!proposal) return;

      setActiveProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, isActive: false } : p))
      );

      // Calculate results
      const proposalVotes = votes.filter((v) => v.proposalId === proposalId);
      const yesVotes = proposalVotes
        .filter((v) => v.vote === "yes")
        .reduce((sum, v) => sum + v.weight, 0);
      const noVotes = proposalVotes
        .filter((v) => v.vote === "no")
        .reduce((sum, v) => sum + v.weight, 0);
      const result = yesVotes > noVotes ? "PASSED" : "FAILED";

      playSound(result === "PASSED" ? "success" : "error");
      showToast({
        type: result === "PASSED" ? "success" : "error",
        title: `📊 Proposal ${result}`,
        message: `"${proposal.title}" - Yes: ${yesVotes}, No: ${noVotes}`,
        duration: 6000,
      });

      sendMessage(
        `📊 PROPOSAL RESULTS: "${proposal.title}" ${result}! Yes: ${yesVotes} | No: ${noVotes}`
      );

      // Award streamer if proposal passed
      if (result === "PASSED") {
        const reward: StreamReward = {
          id: Math.random().toString(36).substr(2, 9),
          streamerId: user?.id || "",
          streamerUsername: user?.login || "",
          amount: 50,
          type: "proposal_reward",
          timestamp: new Date(),
        };

        setRecentRewards((prev) => [...prev, reward]);
        setTotalEarnings((prev) => prev + reward.amount);
      }
    },
    [activeProposals, votes, user]
  );

  const processVote = useCallback(
    (command: ChatCommand) => {
      processVoteCommand(command);
    },
    [activeProposals, votes]
  );

  const claimRewards = useCallback(() => {
    if (totalEarnings === 0) {
      showToast({
        type: "info",
        title: "ℹ️ No Rewards",
        message: "No rewards to claim yet. Keep streaming!",
        duration: 3000,
      });
      return;
    }

    playSound("claim");
    showToast({
      type: "success",
      title: "💰 Rewards Claimed!",
      message: `Successfully claimed ${totalEarnings} MTC from streaming rewards!`,
      action: {
        label: "View Transaction",
        onClick: () => console.log("View on block explorer"),
      },
    });

    // Reset earnings after claim
    setTotalEarnings(0);
    setRecentRewards([]);
  }, [totalEarnings]);

  const value: StreamingContextType = {
    isAuthenticated,
    user,
    isConnected,
    isStreaming,
    streamStats,
    viewerCount,
    chatMessages,
    recentCommands,
    activeProposals,
    votes,
    totalEarnings,
    recentRewards,
    login,
    logout,
    startStream,
    stopStream,
    joinChat,
    leaveChat,
    sendMessage,
    createProposal,
    endProposal,
    processVote,
    claimRewards,
  };

  return (
    <StreamingContext.Provider value={value}>
      {children}
    </StreamingContext.Provider>
  );
};
