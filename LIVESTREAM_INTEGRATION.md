# 📹 Twitch Livestream Integration

## Overview

The MetaCity Twitch integration enables creators to stream their city-building experience while allowing viewers to participate through chat commands and vote on proposals. Streamers earn 10% of all rewards generated through viewer interactions, creating a sustainable creator economy.

## Features

### 🎮 For Streamers

- **Twitch Authentication**: Secure OAuth2 login with Twitch
- **Live Stream Dashboard**: Comprehensive control panel for managing streams
- **Proposal Creation**: Create custom votes for viewers to participate in
- **Real-time Analytics**: View engagement metrics, earnings, and viewer statistics
- **Chat Integration**: Join any Twitch channel and interact with viewers
- **Revenue Sharing**: Automatic 10% cut of viewer-generated rewards

### 👥 For Viewers

- **Chat Commands**: Interactive commands to participate in city building
- **Voting System**: Vote on proposals using simple chat commands
- **Real-time Feedback**: See voting results and impact in real-time
- **Weighted Voting**: Subscribers and moderators get higher vote weights

## Chat Commands

| Command                        | Usage                | Description                 |
| ------------------------------ | -------------------- | --------------------------- |
| `!vote <proposal_id> <yes/no>` | `!vote 1 yes`        | Vote on active proposals    |
| `!build <type>`                | `!build residential` | Suggest building types      |
| `!city`                        | `!city`              | Get current city statistics |
| `!proposals`                   | `!proposals`         | List active proposals       |
| `!help`                        | `!help`              | Show available commands     |

## Components

### 🎛️ StreamerDashboard

**Location**: `components/StreamerDashboard.tsx`

Complete dashboard for streamers featuring:

- Stream status controls (start/stop streaming)
- Chat connection management
- Proposal creation with custom types and durations
- Real-time viewer and engagement metrics
- Earnings tracking with one-click reward claiming
- Recent activity feeds for commands and rewards

**Key Features**:

- **Authentication Flow**: Secure Twitch OAuth integration
- **Stream Controls**: Start/stop streaming with visual indicators
- **Proposal Management**: Create, monitor, and end viewer votes
- **Analytics Dashboard**: Live viewer count, chat messages, votes, earnings
- **Chat Integration**: Join channels and send messages as streamer

### 📊 StreamOverlay

**Location**: `components/StreamOverlay.tsx`

Live overlay component for displaying stream information:

- Current viewer count with real-time updates
- Active proposals with voting progress bars
- Recent activity feed showing votes and commands
- Available chat commands help panel
- Cyberpunk-styled UI matching MetaCity theme

**Display Modes**:

- **Compact**: Minimal overlay showing key stats
- **Full**: Detailed view with all information panels
- **Positioned**: Flexible positioning (top-left, top-right, bottom-left, bottom-right)

### 🔧 StreamingContext

**Location**: `contexts/StreamingContext.tsx`

Global state management for all streaming functionality:

- User authentication state and profile data
- Stream status and viewer metrics
- Chat message handling and command parsing
- Proposal management (create, vote, end)
- Revenue tracking and reward distribution
- Real-time WebSocket chat connection

### 🌐 TwitchService

**Location**: `services/twitchService.ts`

Core Twitch API integration handling:

- OAuth2 authentication flow with token refresh
- WebSocket chat connection and reconnection logic
- Stream data fetching (viewer count, stream status)
- User information and profile management
- Event emission system for real-time updates

## Usage Guide

### Setting Up Streaming

1. **Access Stream Dashboard**

   ```typescript
   // Navigate to the Live Stream tab in MetaCity
   // Click "Connect with Twitch" to authenticate
   ```

2. **Start Streaming**

   ```typescript
   // In StreamerDashboard:
   // 1. Click "Start Stream"
   // 2. Enter channel name in chat connection
   // 3. Click "Join" to connect to chat
   ```

3. **Create Proposals**
   ```typescript
   // Click "New Proposal" button
   // Fill in title, description, type, and duration
   // Proposal automatically becomes active for voting
   ```

### Integration in Main App

The streaming system is fully integrated into MetaCity:

```typescript
// _app.tsx - Global providers
<NotificationProvider>
  <StreamingProvider>
    <Component {...pageProps} />
  </StreamingProvider>
</NotificationProvider>

// index.tsx - Stream tab in navigation
{ id: "streaming", label: "Live Stream", icon: "📹" }

// CityScene.tsx - Optional overlay in 3D view
{isAuthenticated && isStreaming && (
  <StreamOverlay position="top-right" compact={true} />
)}
```

### Chat Command Processing

The system automatically processes viewer commands:

```typescript
// Command parsing in StreamingContext
const processCommand = (message: ChatMessage) => {
  const { command, args } = parseCommand(message.text);

  switch (command) {
    case "vote":
      handleVote(message.user, args[0], args[1]);
      break;
    case "build":
      suggestBuilding(message.user, args[0]);
      break;
    case "city":
      showCityStats(message.channel);
      break;
  }
};
```

## Revenue Model

### Creator Economy

- **10% Revenue Share**: Streamers receive 10% of all rewards generated through viewer interactions
- **Automatic Tracking**: Real-time earnings calculation and display
- **Easy Claiming**: One-click reward claiming in dashboard
- **Transparent System**: All earnings are visible and auditable

### Viewer Incentives

- **Engagement Rewards**: Viewers earn MTC for participating in votes and commands
- **Building Impact**: Viewer decisions directly affect the streamer's MetaCity
- **Community Building**: Chat-based interaction creates shared experience
- **Weighted Participation**: Subscribers and mods have increased voting power

## Technical Architecture

### Authentication Flow

1. **OAuth2 Login**: Secure Twitch authentication with scopes
2. **Token Management**: Automatic refresh and persistent storage
3. **User Profile**: Access to Twitch user data and permissions

### Real-time Communication

1. **WebSocket Chat**: Live connection to Twitch IRC
2. **Command Parsing**: Intelligent parsing of chat messages
3. **Event System**: Real-time updates across all components
4. **Reconnection Logic**: Automatic reconnection on connection loss

### State Management

1. **React Context**: Global state for streaming features
2. **Local Storage**: Persistent authentication and settings
3. **Real-time Sync**: Live updates between overlay and dashboard

## Environment Setup

### Required Twitch App Configuration

Register your application at [Twitch Developers](https://dev.twitch.tv/console):

```env
# .env.local
NEXT_PUBLIC_TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_TWITCH_REDIRECT_URI=http://localhost:3000/auth/twitch/callback
```

### OAuth Scopes Required

- `chat:read` - Read chat messages
- `chat:edit` - Send chat messages
- `user:read:email` - Access user profile information

## Development Notes

### Testing Streaming Features

1. **Local Development**: Use ngrok or similar to test OAuth callbacks
2. **Chat Testing**: Connect to test channels for command validation
3. **Proposal Flow**: Test full voting lifecycle with multiple accounts

### Performance Considerations

- **WebSocket Management**: Efficient connection handling and cleanup
- **State Optimization**: Prevent unnecessary re-renders in overlay
- **Memory Management**: Proper cleanup of chat message history

### Security Features

- **Token Security**: Secure token storage and transmission
- **Rate Limiting**: Prevents spam and API abuse
- **Input Validation**: All user inputs are validated and sanitized

## Future Enhancements

### Planned Features

- **Multi-platform Support**: YouTube, Facebook Gaming integration
- **Advanced Analytics**: Detailed engagement and revenue analytics
- **Custom Overlays**: Streamable overlay customization
- **Moderation Tools**: Advanced chat moderation and filtering
- **Stream Alerts**: Custom notifications for viewer actions

### API Extensions

- **Webhooks**: Real-time notifications for external integrations
- **Stream Highlights**: Automatic clip creation for key moments
- **Viewer Leaderboards**: Top contributors and participants
- **Custom Rewards**: Channel-specific reward systems

## Troubleshooting

### Common Issues

1. **Authentication Fails**: Check client ID and redirect URI configuration
2. **Chat Not Connecting**: Verify channel name and Twitch IRC availability
3. **Commands Not Working**: Ensure proper command format and permissions
4. **Overlay Not Showing**: Check streaming state and authentication status

### Debug Mode

Enable debugging in StreamingContext:

```typescript
const DEBUG_MODE = process.env.NODE_ENV === "development";
```

This comprehensive livestream integration transforms MetaCity from a solo city-builder into a collaborative streaming experience, creating new opportunities for content creators and community engagement while maintaining the core DAO governance mechanics.
