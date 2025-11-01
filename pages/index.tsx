import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProposalsList from '@/components/ProposalsList';
import StakingPanel from '@/components/StakingPanel';
import BuildingsGallery from '@/components/BuildingsGallery';
import { motion } from 'framer-motion';

const CityScene = dynamic(() => import('@/components/CityScene'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyber-blue mx-auto mb-4"></div>
        <p className="text-cyber-blue font-orbitron">Loading MetaCity...</p>
      </div>
    </div>
  )
});

type Tab = 'city' | 'proposals' | 'staking' | 'buildings' | 'dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('city');

  return (
    <>
      <Head>
        <title>MetaCity - DAO-Based City Builder</title>
        <meta name="description" content="Build the future city together through decentralized governance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-dark font-space-grotesk">
        <Header />
        
        {/* Tab Navigation */}
        <nav className="bg-dark-card/50 backdrop-blur-md border-b border-cyber-blue/20 sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'city', label: '🏙️ City View', icon: '🏙️' },
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'proposals', label: '🗳️ Proposals', icon: '🗳️' },
                { id: 'staking', label: '💰 Staking', icon: '💰' },
                { id: 'buildings', label: '🏗️ Buildings', icon: '🏗️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    px-6 py-4 font-orbitron font-medium whitespace-nowrap transition-all
                    ${activeTab === tab.id
                      ? 'bg-gradient-cyber text-white border-b-2 border-cyber-blue'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'city' && (
              <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden border-2 border-cyber-blue/30 shadow-2xl">
                <CityScene />
              </div>
            )}
            
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'proposals' && <ProposalsList />}
            {activeTab === 'staking' && <StakingPanel />}
            {activeTab === 'buildings' && <BuildingsGallery />}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-dark-card/30 border-t border-cyber-blue/20 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 font-orbitron">
              🏙️ MetaCity - Build the Future Together
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by DAO Governance • Secured by Blockchain
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
