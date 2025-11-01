import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-near-black/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-5">
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
              <h1 className="text-3xl font-orbitron font-bold text-white">
                MetaCity
              </h1>
              <p className="text-sm text-text-muted">DAO-Powered City Builder</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-8 mr-4">
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider">Total Staked</p>
                <p className="font-orbitron font-bold text-accent-cyan mt-1">$2.5M</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider">Active Proposals</p>
                <p className="font-orbitron font-bold text-accent-purple mt-1">12</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-muted uppercase tracking-wider">Buildings</p>
                <p className="font-orbitron font-bold text-accent-green mt-1">247</p>
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
