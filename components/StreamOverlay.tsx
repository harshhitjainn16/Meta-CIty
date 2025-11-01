import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Eye,
  MessageCircle,
  TrendingUp,
  Award,
  DollarSign,
  Clock,
  Vote,
  Zap,
  Coins,
} from "lucide-react";
import { useStreaming } from "@/contexts/StreamingContext";

interface StreamOverlayProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  compact?: boolean;
}

export const StreamOverlay: React.FC<StreamOverlayProps> = ({
  position = "top-right",
  compact = false,
}) => {
  const {
    isStreaming,
    viewerCount,
    streamStats,
    chatMessages,
    recentCommands,
    activeProposals,
    votes,
    totalEarnings,
    recentRewards,
  } = useStreaming();

  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isStreaming) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const getStreamDuration = () => {
    if (!streamStats?.startedAt) return "00:00:00";

    const now = currentTime.getTime();
    const start = streamStats.startedAt.getTime();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getActiveVoteResults = (proposalId: string) => {
    const proposalVotes = votes.filter((v) => v.proposalId === proposalId);
    const yesVotes = proposalVotes
      .filter((v) => v.vote === "yes")
      .reduce((sum, v) => sum + v.weight, 0);
    const noVotes = proposalVotes
      .filter((v) => v.vote === "no")
      .reduce((sum, v) => sum + v.weight, 0);
    const total = yesVotes + noVotes;

    return {
      yes: yesVotes,
      no: noVotes,
      total,
      yesPercentage: total > 0 ? Math.round((yesVotes / total) * 100) : 0,
      noPercentage: total > 0 ? Math.round((noVotes / total) * 100) : 0,
    };
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = currentTime.getTime();
    const end = endTime.getTime();
    const diff = end - now;

    if (diff <= 0) return "ENDED";

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 pointer-events-none`}
    >
      <div className="space-y-4 max-w-sm">
        {/* Main Stats Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-lg border border-cyan-400/30 rounded-xl p-4 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-orbitron font-bold text-sm">
                LIVE
              </span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {getStreamDuration()}
            </div>
          </div>

          {/* Stream Stats Grid */}
          <div
            className={`grid ${compact ? "grid-cols-2" : "grid-cols-3"} gap-3`}
          >
            {/* Viewers */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400 font-bold text-lg">
                  {viewerCount}
                </span>
              </div>
              <div className="text-xs text-gray-400">Viewers</div>
            </div>

            {/* Chat Activity */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400 font-bold text-lg">
                  {chatMessages.length}
                </span>
              </div>
              <div className="text-xs text-gray-400">Messages</div>
            </div>

            {/* Earnings */}
            {!compact && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">
                    {totalEarnings}
                  </span>
                </div>
                <div className="text-xs text-gray-400">MTC</div>
              </div>
            )}
          </div>

          {/* City Stats */}
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="text-xs text-gray-400 mb-2">🏙️ MetaCity Status</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Buildings:</span>
                <span className="text-cyan-400 font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Level:</span>
                <span className="text-yellow-400 font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Sustainability:</span>
                <span className="text-green-400 font-bold">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Treasury:</span>
                <span className="text-purple-400 font-bold">12.5K</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Proposals */}
        <AnimatePresence>
          {activeProposals
            .filter((p) => p.isActive)
            .map((proposal, index) => {
              const voteResults = getActiveVoteResults(proposal.id);
              return (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/50 rounded-xl p-4 pointer-events-auto"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Vote className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-orbitron font-bold text-sm">
                        Vote Active
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTimeRemaining(proposal.endTime)}
                    </div>
                  </div>

                  <h4 className="text-white text-sm font-medium mb-2">
                    {proposal.title}
                  </h4>

                  {/* Vote Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-400">
                        YES ({voteResults.yes})
                      </span>
                      <span className="text-red-400">
                        NO ({voteResults.no})
                      </span>
                    </div>

                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-green-400 transition-all duration-500"
                        style={{ width: `${voteResults.yesPercentage}%` }}
                      />
                      <div
                        className="absolute right-0 top-0 h-full bg-red-400 transition-all duration-500"
                        style={{ width: `${voteResults.noPercentage}%` }}
                      />
                    </div>

                    <div className="text-center text-xs text-gray-400">
                      !vote {proposal.id} yes/no
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Recent Activity */}
        {showRecentActivity &&
          (recentCommands.length > 0 || recentRewards.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg border border-gray-600/30 rounded-xl p-3 pointer-events-auto max-h-32 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-400 font-orbitron font-bold text-xs">
                    Activity
                  </span>
                </div>
                <button
                  className="text-gray-400 hover:text-white text-xs"
                  onClick={() => setShowRecentActivity(false)}
                >
                  ×
                </button>
              </div>

              <div className="space-y-1">
                {/* Recent Commands */}
                {recentCommands.slice(-3).map((cmd, index) => (
                  <motion.div
                    key={`cmd-${cmd.user.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-400 font-medium">
                      {cmd.user.displayName}:
                    </span>
                    <span className="text-gray-300">
                      !{cmd.command} {cmd.args.join(" ")}
                    </span>
                  </motion.div>
                ))}

                {/* Recent Rewards */}
                {recentRewards.slice(-2).map((reward, index) => (
                  <motion.div
                    key={`reward-${reward.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <DollarSign className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      +{reward.amount} MTC
                    </span>
                    <span className="text-gray-400">({reward.type})</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Command Help Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-black/70 backdrop-blur-sm border border-gray-600/30 rounded-lg p-2 text-xs text-gray-400"
        >
          <div className="text-center mb-1 text-cyan-400 font-medium">
            Chat Commands
          </div>
          <div className="space-y-0.5">
            <div>!vote &lt;id&gt; yes/no - Vote on proposals</div>
            <div>!build &lt;type&gt; - Suggest building (subs)</div>
            <div>!city - Show city stats</div>
            <div>!help - Show all commands</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StreamOverlay;
