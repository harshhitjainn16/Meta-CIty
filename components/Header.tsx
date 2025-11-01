import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-dark-card/80 backdrop-blur-md border-b border-cyber-blue/30 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              🏙️
            </motion.div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-gradient">
                MetaCity
              </h1>
              <p className="text-sm text-gray-400">DAO-Powered City Builder</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 mr-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Staked</p>
                <p className="font-orbitron font-bold text-cyber-blue">$2.5M</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Active Proposals</p>
                <p className="font-orbitron font-bold text-cyber-purple">12</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Buildings</p>
                <p className="font-orbitron font-bold text-neon-green">247</p>
              </div>
            </div>
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
