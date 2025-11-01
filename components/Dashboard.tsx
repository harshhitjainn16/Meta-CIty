import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  Building,
  Award,
  Bell,
  Volume2,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { playCyberSound } from "@/utils/soundEffects";

const statsData = [
  { name: "Mon", buildings: 12, proposals: 5, value: 2400 },
  { name: "Tue", buildings: 19, proposals: 8, value: 1398 },
  { name: "Wed", buildings: 15, proposals: 6, value: 9800 },
  { name: "Thu", buildings: 22, proposals: 10, value: 3908 },
  { name: "Fri", buildings: 18, proposals: 7, value: 4800 },
  { name: "Sat", buildings: 25, proposals: 12, value: 3800 },
  { name: "Sun", buildings: 20, proposals: 9, value: 4300 },
];

const buildingDistribution = [
  { name: "Residential", value: 35, color: "#00d4ff" },
  { name: "Commercial", value: 25, color: "#b537ff" },
  { name: "Industrial", value: 15, color: "#ff006e" },
  { name: "Green Spaces", value: 20, color: "#39ff14" },
  { name: "Public Services", value: 5, color: "#ff6b35" },
];

const COLORS = ["#00d4ff", "#b537ff", "#ff006e", "#39ff14", "#ff6b35"];

export default function Dashboard() {
  const {
    showToast,
    playSound,
    showBrowserNotification,
    requestNotificationPermission,
  } = useNotifications();

  const handleProposalPass = () => {
    playSound("success");
    playCyberSound("access_granted");
    showToast({
      type: "success",
      title: "🎉 Proposal Passed!",
      message:
        "Solar Farm Initiative #42 has been approved by the community with 89% support.",
      action: {
        label: "View Details",
        onClick: () => console.log("View proposal details"),
      },
    });
    showBrowserNotification("MetaCity DAO - Proposal Passed", {
      body: "Solar Farm Initiative #42 has been approved!",
      icon: "/favicon.ico",
    });
  };

  const handleProposalFail = () => {
    playSound("error");
    playCyberSound("access_denied");
    showToast({
      type: "error",
      title: "❌ Proposal Failed",
      message:
        "Commercial Zone Expansion #23 did not reach the required 60% approval threshold.",
      duration: 7000,
    });
    showBrowserNotification("MetaCity DAO - Proposal Failed", {
      body: "Commercial Zone Expansion #23 was rejected",
      icon: "/favicon.ico",
    });
  };

  const handleBuildingMint = () => {
    playSound("mint");
    playCyberSound("data_transfer");
    showToast({
      type: "success",
      title: "🏗️ Building Minted!",
      message:
        "Your Eco-Tower NFT has been successfully minted to your wallet. Level 5 sustainability achieved!",
      action: {
        label: "View NFT",
        onClick: () => console.log("View NFT on OpenSea"),
      },
    });
    showBrowserNotification("MetaCity - New Building Minted", {
      body: "Your Eco-Tower NFT is ready!",
      icon: "/favicon.ico",
    });
  };

  const handleRewardClaim = () => {
    playSound("claim");
    playCyberSound("system_boot");
    showToast({
      type: "info",
      title: "💰 Rewards Claimed!",
      message:
        "Successfully claimed 1,250 METACITY tokens from your staked buildings.",
      duration: 6000,
    });
  };

  const handleVoteCast = () => {
    playSound("vote");
    playCyberSound("terminal_beep");
    showToast({
      type: "info",
      title: "🗳️ Vote Recorded",
      message:
        "Your vote on Proposal #44 has been successfully recorded on-chain.",
      duration: 4000,
    });
  };

  const handleSystemAlert = () => {
    showToast({
      type: "warning",
      title: "⚠️ Network Congestion",
      message:
        "Monad testnet is experiencing high traffic. Transactions may take longer than usual.",
      persistent: true,
      action: {
        label: "Check Status",
        onClick: () => window.open("https://testnet-rpc.monad.xyz", "_blank"),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Demo Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-gradient p-6 rounded-xl border border-white/10"
      >
        <h3 className="font-orbitron text-xl mb-4 text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          🔔 Real-Time Notifications Demo
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Test the notification system with different types of MetaCity events:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-lg text-green-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProposalPass}
          >
            <CheckCircle className="w-4 h-4" />
            Proposal Pass
          </motion.button>

          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg text-red-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProposalFail}
          >
            ❌ Proposal Fail
          </motion.button>

          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded-lg text-purple-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuildingMint}
          >
            🏗️ Building Mint
          </motion.button>

          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-cyan-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRewardClaim}
          >
            💰 Claim Rewards
          </motion.button>

          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded-lg text-blue-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoteCast}
          >
            🗳️ Cast Vote
          </motion.button>

          <motion.button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg text-yellow-400 text-sm font-space-grotesk transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSystemAlert}
          >
            ⚠️ System Alert
          </motion.button>
        </div>

        <div className="mt-4 p-3 bg-black/50 rounded-lg border border-cyan-400/30">
          <p className="text-xs text-gray-400">
            <Volume2 className="w-3 h-3 inline mr-1" />
            Features: Toast notifications, sound effects, browser notifications
            (requires permission)
          </p>
        </div>
      </motion.div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Building className="w-8 h-8" />}
          title="Total Buildings"
          value="247"
          change="+12%"
          accentColor="text-accent-cyan"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Active Members"
          value="1,834"
          change="+23%"
          accentColor="text-accent-purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Treasury Value"
          value="$2.5M"
          change="+8%"
          accentColor="text-accent-green"
        />
        <StatCard
          icon={<Award className="w-8 h-8" />}
          title="Sustainability Score"
          value="87/100"
          change="+5%"
          accentColor="text-accent-orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient p-6 rounded-xl border border-white/10"
        >
          <h3 className="font-orbitron text-xl mb-4 text-white">
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{
                  background: "#0a0a0a",
                  border: "1px solid #00d4ff50",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Legend />
              <Bar dataKey="buildings" fill="#00d4ff" />
              <Bar dataKey="proposals" fill="#b537ff" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Building Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient p-6 rounded-xl border border-white/10"
        >
          <h3 className="font-orbitron text-xl mb-4 text-white">
            Building Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={buildingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#ffffff"
                dataKey="value"
              >
                {buildingDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background:
                    "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%)",
                  border: "2px solid #00d4ff",
                  borderRadius: "12px",
                  color: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0, 212, 255, 0.3)",
                  padding: "12px 16px",
                  backdropFilter: "blur(10px)",
                }}
                labelStyle={{
                  color: "#00d4ff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Orbitron",
                }}
                itemStyle={{
                  color: "#ffffff",
                  fontSize: "13px",
                  fontFamily: "Space Grotesk",
                }}
                formatter={(value: any, name: string) => [
                  `${value}% (${Math.round((value / 100) * 247)} buildings)`,
                  name,
                ]}
                labelFormatter={(label: string) => `Building Type: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-6 rounded-xl border border-white/10"
      >
        <h3 className="font-orbitron text-2xl mb-4 text-white">
          🏆 Top Builders
        </h3>
        <div className="space-y-3">
          {[
            {
              rank: 1,
              address: "0x1234...5678",
              buildings: 45,
              rewards: "12,500",
              sustainability: 92,
            },
            {
              rank: 2,
              address: "0x2345...6789",
              buildings: 38,
              rewards: "10,200",
              sustainability: 88,
            },
            {
              rank: 3,
              address: "0x3456...7890",
              buildings: 32,
              rewards: "8,900",
              sustainability: 85,
            },
            {
              rank: 4,
              address: "0x4567...8901",
              buildings: 28,
              rewards: "7,500",
              sustainability: 82,
            },
            {
              rank: 5,
              address: "0x5678...9012",
              buildings: 25,
              rewards: "6,800",
              sustainability: 80,
            },
          ].map((builder) => (
            <div
              key={builder.rank}
              className="flex items-center justify-between p-4 bg-dark-gray/50 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold
                  ${
                    builder.rank === 1
                      ? "bg-gradient-to-br from-accent-yellow to-accent-orange text-pure-black"
                      : ""
                  }
                  ${
                    builder.rank === 2
                      ? "bg-gradient-to-br from-gray-300 to-gray-400 text-pure-black"
                      : ""
                  }
                  ${
                    builder.rank === 3
                      ? "bg-gradient-to-br from-accent-orange to-accent-pink text-white"
                      : ""
                  }
                  ${
                    builder.rank > 3
                      ? "bg-dark-gray border border-white/20 text-white"
                      : ""
                  }
                `}
                >
                  #{builder.rank}
                </div>
                <div>
                  <p className="font-mono text-white">{builder.address}</p>
                  <p className="text-xs text-text-muted">
                    {builder.buildings} buildings • Sustainability:{" "}
                    {builder.sustainability}/100
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-orbitron font-bold text-accent-green">
                  {builder.rewards} METACITY
                </p>
                <p className="text-xs text-text-muted">Total Rewards</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  accentColor = "text-white",
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="card-gradient p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={accentColor}>{icon}</div>
        <span className="text-accent-green text-sm font-bold">{change}</span>
      </div>
      <h3 className="text-text-muted text-sm mb-2 uppercase tracking-wider">
        {title}
      </h3>
      <p className={`text-3xl font-orbitron font-bold ${accentColor}`}>
        {value}
      </p>
    </motion.div>
  );
}
