import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building, Award } from 'lucide-react';

const statsData = [
  { name: 'Mon', buildings: 12, proposals: 5, value: 2400 },
  { name: 'Tue', buildings: 19, proposals: 8, value: 1398 },
  { name: 'Wed', buildings: 15, proposals: 6, value: 9800 },
  { name: 'Thu', buildings: 22, proposals: 10, value: 3908 },
  { name: 'Fri', buildings: 18, proposals: 7, value: 4800 },
  { name: 'Sat', buildings: 25, proposals: 12, value: 3800 },
  { name: 'Sun', buildings: 20, proposals: 9, value: 4300 },
];

const buildingDistribution = [
  { name: 'Residential', value: 35, color: '#4CAF50' },
  { name: 'Commercial', value: 25, color: '#2196F3' },
  { name: 'Industrial', value: 15, color: '#FF9800' },
  { name: 'Green Spaces', value: 20, color: '#8BC34A' },
  { name: 'Public Services', value: 5, color: '#9C27B0' },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#8BC34A', '#9C27B0'];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Building className="w-8 h-8" />}
          title="Total Buildings"
          value="247"
          change="+12%"
          color="cyber-blue"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Active Members"
          value="1,834"
          change="+23%"
          color="cyber-purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Treasury Value"
          value="$2.5M"
          change="+8%"
          color="neon-green"
        />
        <StatCard
          icon={<Award className="w-8 h-8" />}
          title="Sustainability Score"
          value="87/100"
          change="+5%"
          color="cyber-pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient p-6 rounded-xl border border-cyber-blue/30"
        >
          <h3 className="font-orbitron text-xl mb-4 text-gradient">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#00d4ff" />
              <YAxis stroke="#00d4ff" />
              <Tooltip 
                contentStyle={{ 
                  background: '#151932', 
                  border: '1px solid #00d4ff',
                  borderRadius: '8px' 
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
          className="card-gradient p-6 rounded-xl border border-cyber-blue/30"
        >
          <h3 className="font-orbitron text-xl mb-4 text-gradient">Building Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={buildingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {buildingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#151932', 
                  border: '1px solid #00d4ff',
                  borderRadius: '8px' 
                }} 
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
        className="card-gradient p-6 rounded-xl border border-cyber-blue/30"
      >
        <h3 className="font-orbitron text-2xl mb-4 text-gradient">🏆 Top Builders</h3>
        <div className="space-y-3">
          {[
            { rank: 1, address: '0x1234...5678', buildings: 45, rewards: '12,500', sustainability: 92 },
            { rank: 2, address: '0x2345...6789', buildings: 38, rewards: '10,200', sustainability: 88 },
            { rank: 3, address: '0x3456...7890', buildings: 32, rewards: '8,900', sustainability: 85 },
            { rank: 4, address: '0x4567...8901', buildings: 28, rewards: '7,500', sustainability: 82 },
            { rank: 5, address: '0x5678...9012', buildings: 25, rewards: '6,800', sustainability: 80 },
          ].map((builder) => (
            <div 
              key={builder.rank}
              className="flex items-center justify-between p-4 bg-dark-card/50 rounded-lg border border-cyber-blue/20 hover:border-cyber-blue/50 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold
                  ${builder.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
                  ${builder.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : ''}
                  ${builder.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800' : ''}
                  ${builder.rank > 3 ? 'bg-gradient-cyber' : ''}
                `}>
                  #{builder.rank}
                </div>
                <div>
                  <p className="font-mono text-white">{builder.address}</p>
                  <p className="text-xs text-gray-400">{builder.buildings} buildings • Sustainability: {builder.sustainability}/100</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-orbitron font-bold text-neon-green">{builder.rewards} METACITY</p>
                <p className="text-xs text-gray-400">Total Rewards</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, title, value, change, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  change: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="card-gradient p-6 rounded-xl border border-cyber-blue/30 hover:border-cyber-blue/60 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`text-${color}`}>{icon}</div>
        <span className="text-neon-green text-sm font-bold">{change}</span>
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-orbitron font-bold text-${color}`}>{value}</p>
    </motion.div>
  );
}
