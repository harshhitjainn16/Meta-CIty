import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Leaf, Coins, TrendingUp, Building2 } from 'lucide-react';
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

const GRID_SIZE = 6;
const CELL_SIZE = 100;

export default function BuildingsGallery() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<BuildingData | null>(null);
  const [filterType, setFilterType] = useState<number | null>(null);

  const filteredBuildings = filterType === null 
    ? mockBuildings 
    : mockBuildings.filter(b => b.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white">City Map View</h2>
          <p className="text-text-muted mt-2">Explore your buildings on the city grid</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="card-gradient px-6 py-3 rounded-lg border border-white/10">
            <span className="text-sm text-text-muted mr-2">Total Buildings:</span>
            <span className="font-orbitron font-bold text-white text-xl">{mockBuildings.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <motion.button 
          onClick={() => setFilterType(null)}
          className={`px-4 py-2 rounded-lg font-space-grotesk whitespace-nowrap border-2 transition-all ${
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
            className={`px-4 py-2 rounded-lg font-space-grotesk whitespace-nowrap border-2 transition-all ${
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

      {/* City Map Grid */}
      <div className="relative flex items-center justify-center">
        {/* Map Container */}
        <div 
          className="relative bg-gradient-to-br from-near-black via-dark-gray to-near-black rounded-xl overflow-hidden border border-white/10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            minHeight: `${GRID_SIZE * CELL_SIZE + 40}px`,
            padding: '20px',
            width: 'fit-content',
            minWidth: `${GRID_SIZE * CELL_SIZE + 40}px`,
          }}
        >
          {/* Grid Lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.3 }}
          >
            {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={20 + i * CELL_SIZE}
                  y1={20}
                  x2={20 + i * CELL_SIZE}
                  y2={20 + GRID_SIZE * CELL_SIZE}
                  stroke="rgba(0, 212, 255, 0.2)"
                  strokeWidth="1"
                />
                <line
                  x1={20}
                  y1={20 + i * CELL_SIZE}
                  x2={20 + GRID_SIZE * CELL_SIZE}
                  y2={20 + i * CELL_SIZE}
                  stroke="rgba(0, 212, 255, 0.2)"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>

          {/* Buildings on Grid */}
          {filteredBuildings.map((building, index) => {
            const buildingType = BUILDING_TYPES[building.type];
            const isSelected = selectedBuilding?.id === building.id;
            const isHovered = hoveredBuilding?.id === building.id;
            
            return (
              <CityBuilding
                key={building.id}
                building={building}
                buildingType={buildingType}
                index={index}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={() => setSelectedBuilding(building)}
                onHover={() => setHoveredBuilding(building)}
                onLeave={() => setHoveredBuilding(null)}
              />
            );
          })}

          {/* Empty Grid Cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = (i % GRID_SIZE) + 1;
            const y = Math.floor(i / GRID_SIZE) + 1;
            const hasBuilding = filteredBuildings.some(b => b.x === x && b.y === y);
            
            if (hasBuilding) return null;
            
            return (
              <motion.div
                key={`empty-${i}`}
                className="absolute border border-dashed rounded-lg"
                style={{
                  left: `${20 + (x - 1) * CELL_SIZE}px`,
                  top: `${20 + (y - 1) * CELL_SIZE}px`,
                  width: `${CELL_SIZE - 8}px`,
                  height: `${CELL_SIZE - 8}px`,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                }}
                whileHover={{ 
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  scale: 1.02,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            );
          })}
        </div>

        {/* Building Details Panel */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-0 right-0 w-80 card-gradient rounded-xl border-2 border-white/30 p-6 z-50 shadow-2xl"
            >
              <motion.button
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black border-2 border-white rounded-lg text-white z-10 hover:bg-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                ✕
              </motion.button>
              
              {(() => {
                const buildingType = BUILDING_TYPES[selectedBuilding.type];
                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="text-5xl p-3 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${buildingType.color}30 0%, ${buildingType.color}10 100%)`,
                        }}
                      >
                        {buildingType.icon}
                      </div>
                      <div>
                        <h3 
                          className="font-orbitron font-bold text-xl"
                          style={{ color: buildingType.color }}
                        >
                          {buildingType.name}
                        </h3>
                        <p className="text-xs text-text-muted">Building #{selectedBuilding.id}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-muted">Level</span>
                          <span className="font-bold text-white">{selectedBuilding.level}/10</span>
                        </div>
                        <div className="w-full bg-dark-gray border border-white/20 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${(selectedBuilding.level / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-muted">Sustainability</span>
                          <span className="font-bold text-white">{selectedBuilding.sustainability}/100</span>
                        </div>
                        <div className="w-full bg-dark-gray border border-white/20 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${selectedBuilding.sustainability}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/20">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-text-muted">Rewards Earned</span>
                          <span className="font-bold text-white">{selectedBuilding.rewards.toLocaleString()} METACITY</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-text-muted">Location</span>
                          <span className="font-mono text-xs text-white font-bold">({selectedBuilding.x}, {selectedBuilding.y})</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Owner</span>
                          <span className="font-mono text-xs text-white">{selectedBuilding.owner}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <motion.button 
                          className="flex-1 bg-black text-white py-2 rounded-lg font-orbitron text-sm font-bold border-2 border-white"
                          whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a' }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          Upgrade
                        </motion.button>
                        <motion.button 
                          className="flex-1 bg-black text-white py-2 rounded-lg font-orbitron text-sm font-bold border-2 border-white"
                          whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a' }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          Claim
                        </motion.button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  );
}

function CityBuilding({
  building,
  buildingType,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: {
  building: BuildingData;
  buildingType: typeof BUILDING_TYPES[number];
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const size = 40 + (building.level * 8);
  const baseX = 20 + (building.x - 1) * CELL_SIZE + (CELL_SIZE - size) / 2;
  const baseY = 20 + (building.y - 1) * CELL_SIZE + (CELL_SIZE - size) / 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: baseX,
        y: baseY,
      }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ 
        scale: 1.12,
        y: baseY - 8,
        zIndex: 10,
      }}
      whileTap={{ scale: 1.08 }}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="absolute cursor-pointer"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-md"
        style={{
          backgroundColor: buildingType.color,
          transform: 'scale(1.5)',
        }}
        animate={{
          opacity: isSelected ? 1 : isHovered ? 0.7 : 0.3,
          scale: isSelected ? 1.6 : isHovered ? 1.55 : 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      
      {/* Building Container */}
      <motion.div
        className="relative w-full h-full rounded-lg flex items-center justify-center backdrop-blur-sm"
        style={{
          borderColor: buildingType.color,
          borderStyle: 'solid',
        }}
        animate={{
          borderWidth: isSelected ? '3px' : '2px',
          backgroundColor: isSelected ? `${buildingType.color}30` : isHovered ? `${buildingType.color}25` : `${buildingType.color}20`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Animated Shadow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: `0 0 0px ${buildingType.color}00`,
          }}
          animate={{
            boxShadow: isSelected 
              ? `0 0 25px ${buildingType.color}FF`
              : isHovered 
              ? `0 0 18px ${buildingType.color}B3`
              : `0 0 8px ${buildingType.color}4D`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />

        {/* Building Icon */}
        <motion.div 
          className="text-3xl relative z-10"
          animate={{
            scale: 1 + (building.level - 1) * 0.1 + (isHovered || isSelected ? 0.1 : 0),
            filter: isSelected 
              ? `drop-shadow(0 0 12px ${buildingType.color})`
              : isHovered 
              ? `drop-shadow(0 0 10px ${buildingType.color})`
              : `drop-shadow(0 0 4px ${buildingType.color}80)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {buildingType.icon}
        </motion.div>

        {/* Level Badge */}
        <motion.div 
          className="absolute -top-2 -right-2 bg-near-black border-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-orbitron font-bold text-white z-20"
          style={{ borderColor: buildingType.color }}
          animate={{
            scale: isHovered || isSelected ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {building.level}
        </motion.div>

        {/* Sustainability Indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg z-10"
          style={{ 
            backgroundColor: buildingType.color,
          }}
          animate={{
            opacity: building.sustainability / 100,
            height: isHovered || isSelected ? '3px' : '2px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </motion.div>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-effect px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            <div className="font-orbitron font-bold text-sm text-white">{buildingType.name}</div>
            <div className="text-xs text-text-muted">Level {building.level} • {building.sustainability}%</div>
          </motion.div>
        )}
      </AnimatePresence>
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
