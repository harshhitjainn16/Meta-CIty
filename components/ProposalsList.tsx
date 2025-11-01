import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Users } from 'lucide-react';
import { BUILDING_TYPES } from '@/constants';

interface Proposal {
  id: number;
  title: string;
  description: string;
  buildingType: number;
  votesFor: number;
  votesAgainst: number;
  endTime: Date;
  status: 'active' | 'passed' | 'failed';
  proposer: string;
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Build Solar Farm in District 3',
    description: 'Proposing to build a sustainable solar farm to power the eastern district',
    buildingType: 4,
    votesFor: 15000,
    votesAgainst: 3000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    proposer: '0x1234...5678',
  },
  {
    id: 2,
    title: 'Create Central Park',
    description: 'A green space for community gathering and environmental benefits',
    buildingType: 3,
    votesFor: 12000,
    votesAgainst: 2000,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active',
    proposer: '0x2345...6789',
  },
  {
    id: 3,
    title: 'Recycling Center Expansion',
    description: 'Expand existing recycling infrastructure for better waste management',
    buildingType: 7,
    votesFor: 8500,
    votesAgainst: 1500,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    proposer: '0x3456...7890',
  },
];

export default function ProposalsList() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white">Governance Proposals</h2>
          <p className="text-text-muted mt-2">Vote on city development decisions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white"
        >
          + Create Proposal
        </button>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 gap-6">
        {mockProposals.map((proposal, index) => (
          <ProposalCard key={proposal.id} proposal={proposal} index={index} />
        ))}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <CreateProposalModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function ProposalCard({ proposal, index }: { proposal: Proposal; index: number }) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const building = BUILDING_TYPES[proposal.buildingType];
  const timeLeft = Math.floor((proposal.endTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-gradient p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div 
              className="text-5xl p-4 rounded-xl border-2 bg-white/5"
              style={{ 
                borderColor: building?.color + '50',
                background: `linear-gradient(135deg, ${building?.color}15 0%, ${building?.color}05 100%)`
              }}
            >
              {building?.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-orbitron font-bold mb-2 text-white">{proposal.title}</h3>
              <p className="text-text-secondary mb-3">{proposal.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-text-muted">
                  Proposed by: <span className="text-white font-mono">{proposal.proposer}</span>
                </span>
                <span className="flex items-center gap-1 text-text-muted">
                  <Clock className="w-4 h-4" />
                  {timeLeft} days left
                </span>
              </div>
            </div>
          </div>

          {/* Voting Progress */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text-secondary">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                For: {proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)
              </span>
              <span className="text-sm text-text-secondary">
                Against: {proposal.votesAgainst.toLocaleString()} ({(100 - forPercentage).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-dark-gray rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-success h-full transition-all"
                style={{ width: `${forPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Vote Buttons */}
        <div className="flex lg:flex-col gap-3">
          <button className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white flex-1 lg:flex-none">
            <span className="text-accent-green">✓</span> Vote For
          </button>
          <button className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white flex-1 lg:flex-none">
            <span className="text-accent-pink">✗</span> Vote Against
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CreateProposalModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-gradient p-8 rounded-2xl border-2 border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Create New Proposal</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Proposal Title</label>
            <input
              type="text"
              className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
              placeholder="Build Solar Farm in District 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Description</label>
            <textarea
              className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 h-32 placeholder:text-text-muted"
              placeholder="Describe the benefits and impact of this proposal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Building Type</label>
              <select className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50">
                {BUILDING_TYPES.map((building) => (
                  <option key={building.id} value={building.id} className="bg-dark-gray">
                    {building.icon} {building.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Funding Required (ETH)</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
                placeholder="0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">X Position</label>
              <input
                type="number"
                className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Y Position</label>
              <input
                type="number"
                className="w-full bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 placeholder:text-text-muted"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white flex-1">
              Create Proposal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-black text-white font-orbitron font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 border-2 border-white flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
