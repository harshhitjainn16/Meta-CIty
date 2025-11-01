import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  Users,
  MessageCircle,
  Vote,
  DollarSign,
  Settings,
  Eye,
  Twitch,
  LogOut,
  Plus,
  X,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { useStreaming } from "@/contexts/StreamingContext";
import { useNotifications } from "@/contexts/NotificationContext";

export const StreamerDashboard: React.FC = () => {
  const {
    isAuthenticated,
    user,
    isConnected,
    isStreaming,
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
    claimRewards,
  } = useStreaming();

  const { showToast, playSound } = useNotifications();

  const [channelName, setChannelName] = useState(user?.login || "");
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    type: "building" as "building" | "policy" | "upgrade" | "event",
    options: ["Yes", "No"],
    duration: 5, // minutes
  });
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const handleLogin = () => {
    login();
    showToast({
      type: "info",
      title: "🔐 Twitch Login",
      message: "Opening Twitch authentication window...",
      duration: 3000,
    });
  };

  const handleStartStream = () => {
    startStream();
    playSound("success");
  };

  const handleStopStream = () => {
    stopStream();
    playSound("notification");
  };

  const handleJoinChat = () => {
    if (!channelName.trim()) {
      showToast({
        type: "error",
        title: "❌ Channel Required",
        message: "Please enter a Twitch channel name",
        duration: 3000,
      });
      return;
    }
    joinChat(channelName.trim());
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    sendMessage(chatMessage);
    setChatMessage("");

    playSound("notification");
  };

  const handleCreateProposal = () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      showToast({
        type: "error",
        title: "❌ Form Incomplete",
        message: "Please fill in title and description",
        duration: 3000,
      });
      return;
    }

    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + newProposal.duration);

    createProposal({
      ...newProposal,
      endTime,
      createdBy: user?.login || "streamer",
      isActive: true,
    });

    // Reset form
    setNewProposal({
      title: "",
      description: "",
      type: "building",
      options: ["Yes", "No"],
      duration: 5,
    });
    setShowProposalForm(false);

    playSound("success");
  };

  const handleEndProposal = (proposalId: string) => {
    endProposal(proposalId);
    playSound("notification");
  };

  const handleClaimRewards = () => {
    claimRewards();
  };

  const getVoteResults = (proposalId: string) => {
    const proposalVotes = votes.filter((v) => v.proposalId === proposalId);
    const yesVotes = proposalVotes
      .filter((v) => v.vote === "yes")
      .reduce((sum, v) => sum + v.weight, 0);
    const noVotes = proposalVotes
      .filter((v) => v.vote === "no")
      .reduce((sum, v) => sum + v.weight, 0);
    return { yes: yesVotes, no: noVotes, total: yesVotes + noVotes };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="mb-6">
            <Twitch className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
              🎮 MetaCity Streamer
            </h2>
            <p className="text-gray-400">
              Connect with Twitch to start streaming your MetaCity and earn
              rewards from viewer interactions!
            </p>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-orbitron font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
          >
            <Twitch className="w-6 h-6" />
            Connect with Twitch
          </motion.button>

          <div className="mt-6 text-sm text-gray-400">
            <h3 className="text-white font-semibold mb-2">Features:</h3>
            <ul className="space-y-1">
              <li>• Live stream your city building</li>
              <li>• Viewer chat voting on proposals</li>
              <li>• Earn 10% of generated rewards</li>
              <li>• Interactive building commands</li>
              <li>• Real-time engagement metrics</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.profile_image_url || "/default-avatar.png"}
              alt={user?.display_name}
              className="w-12 h-12 rounded-full border-2 border-purple-400"
            />
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">
                Welcome, {user?.display_name}!
              </h1>
              <p className="text-gray-400">MetaCity Streamer Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isStreaming && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/50 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm">LIVE</span>
              </div>
            )}

            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-orbitron font-bold text-white">
                {viewerCount}
              </span>
            </div>
            <h3 className="text-purple-400 font-semibold">Viewers</h3>
            <p className="text-gray-400 text-sm">Currently watching</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-orbitron font-bold text-white">
                {chatMessages.length}
              </span>
            </div>
            <h3 className="text-blue-400 font-semibold">Chat Messages</h3>
            <p className="text-gray-400 text-sm">Total messages</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Vote className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-orbitron font-bold text-white">
                {votes.length}
              </span>
            </div>
            <h3 className="text-green-400 font-semibold">Total Votes</h3>
            <p className="text-gray-400 text-sm">Viewer participation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-orbitron font-bold text-white">
                {totalEarnings}
              </span>
            </div>
            <h3 className="text-yellow-400 font-semibold">MTC Earned</h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">Creator rewards</p>
              <button
                onClick={handleClaimRewards}
                disabled={totalEarnings === 0}
                className="text-xs bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-2 py-1 rounded disabled:opacity-50"
              >
                Claim
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stream Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">
              🎥 Stream Controls
            </h2>

            <div className="space-y-4">
              {/* Stream Status */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <h3 className="text-white font-semibold">Stream Status</h3>
                  <p className="text-gray-400 text-sm">
                    {isStreaming
                      ? "Currently streaming MetaCity"
                      : "Stream offline"}
                  </p>
                </div>
                <button
                  onClick={isStreaming ? handleStopStream : handleStartStream}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isStreaming
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isStreaming ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isStreaming ? "Stop Stream" : "Start Stream"}
                </button>
              </div>

              {/* Chat Connection */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">
                    Chat Connection
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Channel name"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="flex-1 bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      onClick={isConnected ? leaveChat : handleJoinChat}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        isConnected
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white"
                      }`}
                    >
                      {isConnected ? "Leave" : "Join"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Send Message */}
              {isConnected && (
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">
                    Send Chat Message
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Proposals Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-orbitron font-bold text-white">
                🗳️ Proposals
              </h2>
              <button
                onClick={() => setShowProposalForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            {/* Active Proposals */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeProposals.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Vote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active proposals</p>
                  <p className="text-sm">Create one to engage viewers!</p>
                </div>
              ) : (
                activeProposals.map((proposal) => {
                  const results = getVoteResults(proposal.id);
                  return (
                    <div
                      key={proposal.id}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-600/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold">
                          {proposal.title}
                        </h3>
                        <button
                          onClick={() => handleEndProposal(proposal.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          End
                        </button>
                      </div>

                      <p className="text-gray-400 text-sm mb-3">
                        {proposal.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div>
                          <div className="text-green-400 font-bold">
                            {results.yes}
                          </div>
                          <div className="text-gray-400">YES</div>
                        </div>
                        <div>
                          <div className="text-red-400 font-bold">
                            {results.no}
                          </div>
                          <div className="text-gray-400">NO</div>
                        </div>
                        <div>
                          <div className="text-white font-bold">
                            {results.total}
                          </div>
                          <div className="text-gray-400">TOTAL</div>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-center text-gray-500 font-mono">
                        !vote {proposal.id} yes/no
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6"
        >
          <h2 className="text-xl font-orbitron font-bold text-white mb-4">
            ⚡ Recent Activity
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Commands */}
            <div>
              <h3 className="text-white font-semibold mb-3">
                💬 Chat Commands
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentCommands.length === 0 ? (
                  <p className="text-gray-400 text-sm">No commands yet</p>
                ) : (
                  recentCommands
                    .slice(-10)
                    .reverse()
                    .map((cmd, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-800/30 rounded"
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          {cmd.user.displayName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">
                            <span className="font-medium">
                              {cmd.user.displayName}:
                            </span>
                            <span className="text-blue-400 ml-2">
                              !{cmd.command} {cmd.args.join(" ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Recent Rewards */}
            <div>
              <h3 className="text-white font-semibold mb-3">
                💰 Recent Rewards
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentRewards.length === 0 ? (
                  <p className="text-gray-400 text-sm">No rewards yet</p>
                ) : (
                  recentRewards
                    .slice(-10)
                    .reverse()
                    .map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-gray-800/30 rounded"
                      >
                        <Award className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <div className="text-sm text-white">
                            <span className="text-yellow-400 font-bold">
                              +{reward.amount} MTC
                            </span>
                            <span className="text-gray-400 ml-2">
                              ({reward.type})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {reward.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* New Proposal Modal */}
      <AnimatePresence>
        {showProposalForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowProposalForm(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gray-900 border border-purple-400/30 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron font-bold text-white">
                  Create Proposal
                </h3>
                <button
                  onClick={() => setShowProposalForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) =>
                      setNewProposal((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                    placeholder="e.g., Build Solar Farm in District 3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) =>
                      setNewProposal((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none h-20 resize-none"
                    placeholder="Describe what viewers are voting on..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Type
                  </label>
                  <select
                    value={newProposal.type}
                    onChange={(e) =>
                      setNewProposal((prev) => ({
                        ...prev,
                        type: e.target.value as any,
                      }))
                    }
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="building">Building</option>
                    <option value="policy">Policy</option>
                    <option value="upgrade">Upgrade</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newProposal.duration}
                    onChange={(e) =>
                      setNewProposal((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value) || 5,
                      }))
                    }
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                    min="1"
                    max="30"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowProposalForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProposal}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamerDashboard;
