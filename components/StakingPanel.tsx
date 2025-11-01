import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Wallet, Award } from 'lucide-react';

export default function StakingPanel() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StakingStatCard
          icon={<Coins className="w-6 h-6" />}
          title="Your Staked"
          value="5,000"
          subtitle="METACITY"
          accentColor="text-accent-cyan"
        />
        <StakingStatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="APY"
          value="10%"
          subtitle="Annual Yield"
          accentColor="text-accent-green"
        />
        <StakingStatCard
          icon={<Award className="w-6 h-6" />}
          title="Rewards"
          value="150"
          subtitle="METACITY"
          accentColor="text-accent-purple"
        />
        <StakingStatCard
          icon={<Wallet className="w-6 h-6" />}
          title="Wallet Balance"
          value="12,500"
          subtitle="METACITY"
          accentColor="text-accent-orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stake Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-gradient p-8 rounded-xl border border-white/10"
        >
          <h3 className="text-2xl font-orbitron font-bold mb-6 text-white">
            💰 Stake Tokens
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-text-secondary">Amount to Stake</label>
                <button className="text-xs text-white hover:text-gray-300 hover:underline">
                  Max: 12,500
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-4 pr-24 text-lg text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-orbitron">
                  METACITY
                </span>
              </div>
            </div>

            <div className="bg-dark-gray/50 rounded-lg p-4 space-y-2 border border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Daily Rewards</span>
                <span className="text-white font-bold">
                  {stakeAmount ? ((parseFloat(stakeAmount) * 0.1) / 365).toFixed(2) : '0.00'} METACITY
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Annual Rewards</span>
                <span className="text-white font-bold">
                  {stakeAmount ? (parseFloat(stakeAmount) * 0.1).toFixed(2) : '0.00'} METACITY
                </span>
              </div>
            </div>

            <button className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 w-full border-2 border-white">
              Stake Tokens
            </button>
          </div>
        </motion.div>

        {/* Unstake Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-gradient p-8 rounded-xl border border-white/10"
        >
          <h3 className="text-2xl font-orbitron font-bold mb-6 text-white">
            🔓 Unstake & Claim
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-text-secondary">Amount to Unstake</label>
                <button className="text-xs text-white hover:text-gray-300 hover:underline">
                  Max: 5,000
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-4 pr-24 text-lg text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-orbitron">
                  METACITY
                </span>
              </div>
            </div>

            <div className="bg-gradient-success/20 rounded-lg p-4 border border-accent-green/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Pending Rewards</p>
                  <p className="text-2xl font-orbitron font-bold text-accent-green">150.23 METACITY</p>
                </div>
                <Award className="w-12 h-12 text-accent-green" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white">
                Unstake
              </button>
              <button className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white">
                Claim Rewards
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staking Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-gradient p-8 rounded-xl border border-white/10"
      >
        <h3 className="text-2xl font-orbitron font-bold mb-6 text-white">
          📊 Staking Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-dark-gray/50 rounded-lg border border-accent-cyan/30">
            <p className="text-text-muted mb-2">Total Value Locked</p>
            <p className="text-3xl font-orbitron font-bold text-accent-cyan">$2.5M</p>
          </div>
          <div className="text-center p-6 bg-dark-gray/50 rounded-lg border border-accent-purple/30">
            <p className="text-text-muted mb-2">Total Stakers</p>
            <p className="text-3xl font-orbitron font-bold text-accent-purple">1,234</p>
          </div>
          <div className="text-center p-6 bg-dark-gray/50 rounded-lg border border-accent-green/30">
            <p className="text-text-muted mb-2">Rewards Distributed</p>
            <p className="text-3xl font-orbitron font-bold text-accent-green">450K</p>
          </div>
        </div>

        <div className="mt-6 bg-dark-gray/50 rounded-lg p-6 border border-white/10">
          <h4 className="font-orbitron font-bold mb-4 text-white">How Staking Works</h4>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start">
              <span className="text-white mr-2">•</span>
              Stake METACITY tokens to earn 10% APY in rewards
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">•</span>
              Rewards are calculated daily and can be claimed anytime
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">•</span>
              Stakers get voting power in DAO governance
            </li>
            <li className="flex items-start">
              <span className="text-white mr-2">•</span>
              No lock-up period - unstake whenever you want
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function StakingStatCard({ icon, title, value, subtitle, accentColor = "text-white" }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="card-gradient p-6 rounded-xl border border-white/10"
    >
      <div className={accentColor + " mb-3"}>{icon}</div>
      <p className="text-sm text-text-muted mb-1 uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-orbitron font-bold ${accentColor}`}>{value}</p>
      <p className="text-xs text-text-muted">{subtitle}</p>
    </motion.div>
  );
}
