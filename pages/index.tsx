import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import ProposalsList from "@/components/ProposalsList";
import StakingPanel from "@/components/StakingPanel";
import BuildingsGallery from "@/components/BuildingsGallery";
import { motion } from "framer-motion";

const CityScene = dynamic(() => import("@/components/CityScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-pure-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white font-orbitron">Loading MetaCity...</p>
      </div>
    </div>
  ),
});

type Tab = "city" | "proposals" | "staking" | "buildings" | "dashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("city");

  return (
    <>
      <Head>
        <title>MetaCity - DAO-Based City Builder</title>
        <meta
          name="description"
          content="Build the future city together through decentralized governance"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-pure-black font-space-grotesk">
        <Header />

        {/* Tab Navigation */}
        <nav className="bg-near-black/80 backdrop-blur-xl border-b border-white/10 sticky top-[73px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex space-x-2 overflow-x-auto py-2">
              {[
                { id: "city", label: "City View", icon: "🏙️" },
                { id: "dashboard", label: "Dashboard", icon: "📊" },
                { id: "proposals", label: "Proposals", icon: "🗳️" },
                { id: "staking", label: "Staking", icon: "💰" },
                { id: "buildings", label: "Buildings", icon: "🏗️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    px-6 py-3 font-space-grotesk font-medium whitespace-nowrap transition-all rounded-lg
                    ${
                      activeTab === tab.id
                        ? "bg-white text-pure-black border border-white shadow-lg shadow-white/10"
                        : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent hover:border-white/20"
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
            {activeTab === "city" && (
              <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden border border-white/20 shadow-white-xl">
                <CityScene />
              </div>
            )}

            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "proposals" && <ProposalsList />}
            {activeTab === "staking" && <StakingPanel />}
            {activeTab === "buildings" && <BuildingsGallery />}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-near-black border-t border-white/10 mt-16 py-10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white font-orbitron text-lg">
              🏙️ MetaCity - Build the Future Together
            </p>
            <p className="text-sm text-text-muted mt-2">
              Powered by DAO Governance • Secured by Blockchain
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
