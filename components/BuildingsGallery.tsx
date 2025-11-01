import { motion } from 'framer-motion';
import { BUILDING_TYPES } from '@/lib/contracts';

interface BuildingData {
  id: number;
  type: number;
  level: number;
  sustainability: number;
  owner: string;
  rewards: number;
}

const mockBuildings: BuildingData[] = [
  { id: 1, type: 0, level: 3, sustainability: 68, owner: '0x1234...5678', rewards: 245 },
  { id: 2, type: 1, level: 5, sustainability: 55, owner: '0x2345...6789', rewards: 589 },
  { id: 3, type: 3, level: 2, sustainability: 100, owner: '0x3456...7890', rewards: 156 },
  { id: 4, type: 4, level: 4, sustainability: 98, owner: '0x4567...8901', rewards: 423 },
  { id: 5, type: 2, level: 3, sustainability: 42, owner: '0x5678...9012', rewards: 312 },
  { id: 6, type: 5, level: 2, sustainability: 75, owner: '0x6789...0123', rewards: 198 },
  { id: 7, type: 6, level: 3, sustainability: 80, owner: '0x7890...1234', rewards: 267 },
  { id: 8, type: 7, level: 4, sustainability: 95, owner: '0x8901...2345', rewards: 401 },
];

export default function BuildingsGallery() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-orbitron font-bold text-gradient">Building Collection</h2>
        <p className="text-gray-400 mt-2">Your NFT buildings and their performance</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-gradient-cyber rounded-lg font-orbitron whitespace-nowrap">
          All Buildings
        </button>
        {BUILDING_TYPES.map((type) => (
          <button
            key={type.id}
            className="px-4 py-2 bg-dark-card border border-cyber-blue/30 rounded-lg font-orbitron whitespace-nowrap hover:border-cyber-blue transition-all"
          >
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockBuildings.map((building, index) => (
          <BuildingCard key={building.id} building={building} index={index} />
        ))}
      </div>
    </div>
  );
}

function BuildingCard({ building, index }: { building: BuildingData; index: number }) {
  const buildingType = BUILDING_TYPES[building.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="card-gradient rounded-xl overflow-hidden border-2 border-cyber-blue/30 hover:border-cyber-blue transition-all cursor-pointer group"
    >
      {/* Building Visual */}
      <div 
        className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${buildingType.color}40 0%, ${buildingType.color}20 100%)` 
        }}
      >
        <div className="text-8xl group-hover:scale-110 transition-transform">
          {buildingType.icon}
        </div>
        <div className="absolute top-2 right-2 bg-dark-card/80 backdrop-blur px-3 py-1 rounded-full text-xs font-orbitron">
          Level {building.level}
        </div>
        <div className="absolute top-2 left-2 bg-dark-card/80 backdrop-blur px-3 py-1 rounded-full text-xs font-orbitron">
          #{building.id}
        </div>
      </div>

      {/* Building Info */}
      <div className="p-5 space-y-3">
        <h3 className="font-orbitron font-bold text-xl" style={{ color: buildingType.color }}>
          {buildingType.name}
        </h3>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Sustainability</span>
            <span className="font-bold text-neon-green">{building.sustainability}/100</span>
          </div>
          <div className="w-full bg-dark-card rounded-full h-2">
            <div
              className="bg-gradient-to-r from-neon-green to-cyber-blue h-2 rounded-full transition-all"
              style={{ width: `${building.sustainability}%` }}
            />
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span className="text-gray-400">Rewards Earned</span>
            <span className="font-bold text-cyber-purple">{building.rewards} METACITY</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Owner</span>
            <span className="font-mono text-xs text-cyber-blue">{building.owner}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 flex gap-2">
          <button className="flex-1 bg-gradient-cyber py-2 rounded-lg font-orbitron text-sm hover:opacity-80 transition-opacity">
            Upgrade
          </button>
          <button className="flex-1 bg-dark-card border border-cyber-blue/50 py-2 rounded-lg font-orbitron text-sm hover:bg-cyber-blue/10 transition-all">
            Claim
          </button>
        </div>
      </div>
    </motion.div>
  );
}
