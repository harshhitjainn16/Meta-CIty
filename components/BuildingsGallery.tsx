import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Leaf, Coins, TrendingUp, Building2, MapPin, User, Zap, Award } from 'lucide-react';
import { BUILDING_TYPES } from '@/constants';

interface BuildingData {
  id: number;
  type: number;
  level: number;
  sustainability: number;
  owner: string;
  rewards: number;
  x: number;
  y: number;
}

const mockBuildings: BuildingData[] = [
  { id: 1, type: 0, level: 3, sustainability: 68, owner: '0x1234...5678', rewards: 245, x: 1, y: 1 },
  { id: 2, type: 1, level: 5, sustainability: 55, owner: '0x2345...6789', rewards: 589, x: 3, y: 1 },
  { id: 3, type: 3, level: 2, sustainability: 100, owner: '0x3456...7890', rewards: 156, x: 5, y: 1 },
  { id: 4, type: 4, level: 4, sustainability: 98, owner: '0x4567...8901', rewards: 423, x: 2, y: 3 },
  { id: 5, type: 2, level: 3, sustainability: 42, owner: '0x5678...9012', rewards: 312, x: 4, y: 3 },
  { id: 6, type: 5, level: 2, sustainability: 75, owner: '0x6789...0123', rewards: 198, x: 1, y: 5 },
  { id: 7, type: 6, level: 3, sustainability: 80, owner: '0x7890...1234', rewards: 267, x: 3, y: 5 },
  { id: 8, type: 7, level: 4, sustainability: 95, owner: '0x8901...2345', rewards: 401, x: 5, y: 5 },
];

export default function BuildingsGallery() {
  const [filterType, setFilterType] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'level' | 'rewards' | 'sustainability'>('level');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);

  const filteredBuildings = filterType === null 
    ? mockBuildings 
    : mockBuildings.filter(b => b.type === filterType);

  const sortedBuildings = [...filteredBuildings].sort((a, b) => {
    switch (sortBy) {
      case 'level':
        return b.level - a.level;
      case 'rewards':
        return b.rewards - a.rewards;
      case 'sustainability':
        return b.sustainability - a.sustainability;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white">Buildings Collection</h2>
          <p className="text-text-muted mt-2">Manage and explore all buildings in MetaCity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="card-gradient px-6 py-3 rounded-lg border border-white/10">
            <span className="text-sm text-text-muted mr-2">Total Buildings:</span>
            <span className="font-orbitron font-bold text-white text-xl">{mockBuildings.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Leaf className="w-8 h-8" />}
          title="Total Sustainability"
          value={Math.round(mockBuildings.reduce((sum, b) => sum + b.sustainability, 0) / mockBuildings.length).toString()}
          change="+5%"
          accentColor="text-accent-green"
        />
        <StatCard
          icon={<Coins className="w-8 h-8" />}
          title="Total Rewards"
          value={mockBuildings.reduce((sum, b) => sum + b.rewards, 0).toLocaleString()}
          change="+12%"
          accentColor="text-accent-purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Avg Level"
          value={(mockBuildings.reduce((sum, b) => sum + b.level, 0) / mockBuildings.length).toFixed(1)}
          change="+3%"
          accentColor="text-accent-cyan"
        />
        <StatCard
          icon={<Building2 className="w-8 h-8" />}
          title="Building Types"
          value={new Set(mockBuildings.map(b => b.type)).size.toString()}
          change="+2"
          accentColor="text-accent-orange"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 flex-1 min-w-0">
          <motion.button 
            onClick={() => setFilterType(null)}
            className={`px-4 py-2 rounded-lg font-space-grotesk whitespace-nowrap border-2 transition-all flex-shrink-0 ${
              filterType === null 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-black text-white border-white/50 hover:border-white'
            }`}
            whileHover={{ 
              scale: 1.05,
              borderColor: '#ffffff',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            All Buildings
          </motion.button>
          {BUILDING_TYPES.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-lg font-space-grotesk whitespace-nowrap border-2 transition-all flex-shrink-0 ${
                filterType === type.id
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-black text-white border-white/50 hover:border-white'
              }`}
              whileHover={{ 
                scale: 1.05,
                borderColor: '#ffffff',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="mr-2">{type.icon}</span> {type.name}
            </motion.button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-text-muted text-sm whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'level' | 'rewards' | 'sustainability')}
            className="bg-black border-2 border-white/50 text-white px-4 py-2 rounded-lg font-space-grotesk focus:border-white focus:outline-none min-w-[140px]"
          >
            <option value="level">Level</option>
            <option value="rewards">Rewards</option>
            <option value="sustainability">Sustainability</option>
          </select>
        </div>
      </div>

      {/* Building Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {sortedBuildings.map((building, index) => (
            <BuildingCard
              key={building.id}
              building={building}
              index={index}
              isSelected={selectedBuilding?.id === building.id}
              onSelect={() => setSelectedBuilding(selectedBuilding?.id === building.id ? null : building)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedBuildings.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <p className="text-text-muted text-lg">No buildings found matching your filters</p>
        </div>
      )}
    </div>
  );
}

function BuildingCard({
  building,
  index,
  isSelected,
  onSelect,
}: {
  building: BuildingData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const buildingType = BUILDING_TYPES[building.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
        isSelected 
          ? 'border-white shadow-2xl shadow-white/20' 
          : 'border-white/20 hover:border-white/40'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${buildingType.color}15 0%, rgba(10, 10, 10, 0.95) 100%)`
          : 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
      }}
    >
      {/* Glow Effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 opacity-30 blur-xl"
          style={{ backgroundColor: buildingType.color }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Card Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="text-4xl sm:text-5xl p-3 sm:p-4 rounded-xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${buildingType.color}30 0%, ${buildingType.color}10 100%)`,
                boxShadow: `0 8px 32px ${buildingType.color}30`,
              }}
            >
              {buildingType.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="font-orbitron font-bold text-base sm:text-lg truncate"
                style={{ color: buildingType.color }}
              >
                {buildingType.name}
              </h3>
              <p className="text-xs text-text-muted">Building #{building.id}</p>
            </div>
          </div>
          {/* Level Badge */}
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-orbitron font-bold text-white flex-shrink-0"
            style={{
              borderColor: buildingType.color,
              backgroundColor: `${buildingType.color}20`,
            }}
          >
            <span className="text-lg sm:text-xl">{building.level}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sustainability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-accent-green flex-shrink-0" />
              <span className="text-xs text-text-muted font-space-grotesk truncate">Sustainability</span>
            </div>
            <div className="relative pt-1">
              <div className="w-full bg-dark-gray/50 border border-white/10 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: buildingType.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${building.sustainability}%` }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-bold text-white absolute -top-0.5 right-0">
                {building.sustainability}%
              </span>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-accent-purple flex-shrink-0" />
              <span className="text-xs text-text-muted font-space-grotesk truncate">Rewards</span>
            </div>
            <div>
              <p className="text-sm font-orbitron font-bold text-white">
                {building.rewards.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">METACITY</p>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-4 h-4 text-accent-cyan flex-shrink-0" />
              <span className="text-text-muted font-space-grotesk truncate">Level Progress</span>
            </div>
            <span className="font-bold text-white whitespace-nowrap flex-shrink-0">{building.level}/10</span>
          </div>
          <div className="w-full bg-dark-gray/50 border border-white/10 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(building.level / 10) * 100}%` }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-text-muted min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="font-space-grotesk truncate">Location</span>
            </div>
            <span className="font-mono font-bold text-white whitespace-nowrap flex-shrink-0">({building.x}, {building.y})</span>
          </div>
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-text-muted min-w-0">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="font-space-grotesk truncate">Owner</span>
            </div>
            <span className="font-mono text-white truncate ml-2 max-w-[140px] sm:max-w-[160px] text-right" title={building.owner}>{building.owner}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <motion.button
            className="flex-1 bg-black text-white py-2.5 rounded-lg font-orbitron text-xs sm:text-sm font-bold border-2 border-white/50 hover:border-white transition-all min-w-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle upgrade action
            }}
          >
            Upgrade
          </motion.button>
          <motion.button
            className="flex-1 bg-black text-white py-2.5 rounded-lg font-orbitron text-xs sm:text-sm font-bold border-2 border-white/50 hover:border-white transition-all flex items-center justify-center gap-2 min-w-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle claim action
            }}
          >
            <Award className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Claim</span>
          </motion.button>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{ backgroundColor: buildingType.color }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function StatCard({ icon, title, value, change, accentColor = "text-white" }: { 
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
      <h3 className="text-text-muted text-sm mb-2 uppercase tracking-wider">{title}</h3>
      <p className={`text-3xl font-orbitron font-bold ${accentColor}`}>{value}</p>
    </motion.div>
  );
}
