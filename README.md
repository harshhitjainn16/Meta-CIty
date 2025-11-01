# 🏙️ MetaCity - DAO-Based City Builder Game

<div align="center">

![MetaCity Banner](https://img.shields.io/badge/MetaCity-DAO%20Powered-00d4ff?style=for-the-badge&logo=ethereum)
![Build Status](https://img.shields.io/badge/build-passing-neon?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)

**Build the future city together through decentralized governance**

[Demo](https://metacity-dao.vercel.app) • [Docs](#features) • [Deploy](#deployment)

</div>

---

## 🎮 Overview

**MetaCity** is an innovative DAO-based city builder game that combines:

- 🏛️ **Decentralized Governance** - Community-driven city development
- 🏗️ **NFT Buildings** - Each building is a unique NFT with real utility
- 💰 **DeFi Mechanics** - Staking, yield farming, and reward distribution
- 🌱 **Sustainability Scoring** - Earn more rewards for eco-friendly choices
- 🎨 **Stunning 3D Visuals** - Interactive city visualization with Three.js

## ✨ Key Features

### 🗳️ DAO Governance

- **Proposal System**: Create proposals for new buildings
- **Token-Weighted Voting**: Vote with METACITY tokens
- **Treasury Management**: Community-controlled funding
- **Execution**: Automatic building creation when proposals pass

### 🏗️ Building NFTs

- **8 Building Types**: Residential, Commercial, Industrial, Parks, Solar Farms, Hospitals, Schools, Recycling Centers
- **Level System**: Upgrade buildings to increase rewards
- **Sustainability Metrics**: Each building has environmental impact scores
- **Economic Value**: Buildings generate passive income

### 💎 DeFi Features

- **Staking**: 10% APY on METACITY tokens
- **Yield Farming**: Earn rewards from building ownership
- **Reward Multipliers**: Sustainability bonuses
- **No Lock-up Period**: Unstake anytime

### 📊 Analytics Dashboard

- **Real-time Statistics**: Track city growth
- **Leaderboards**: Top builders and contributors
- **Performance Metrics**: Building distribution and activity
- **Visual Charts**: Interactive data visualization

### 🌐 3D City View

- **Interactive Scene**: Built with React Three Fiber
- **Dynamic Lighting**: Cyberpunk-themed aesthetics
- **Building Interactions**: Click buildings for details
- **Grid System**: Organized city layout

## 🛠️ Tech Stack

### Smart Contracts

- **Solidity ^0.8.20** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **ERC-20** - Token standard (METACITY)
- **ERC-721** - NFT standard (Buildings)

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js / React Three Fiber** - 3D visualization
- **Framer Motion** - Animations
- **RainbowKit** - Wallet connections
- **Wagmi** - Ethereum interactions
- **Recharts** - Data visualization

### Blockchain Networks

- **Monad Testnet** - High-performance EVM blockchain
- **Local Hardhat** - Development and testing

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/metacity-dao.git
cd metacity-dao
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add:

- Your private key (for deployment)
- WalletConnect Project ID (get from https://cloud.walletconnect.com)
- RPC URLs

4. **Compile smart contracts**

```bash
npm run compile
```

5. **Run local development**

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📜 Smart Contract Deployment

### Deploy to Monad Testnet

1. **Get test tokens**

   - Get MON from Monad Faucet (check Monad Discord for faucet access)
   - Add Monad Testnet to MetaMask:
     - Network Name: Monad Testnet
     - RPC URL: https://testnet-rpc.monad.xyz
     - Chain ID: 10143
     - Currency Symbol: MON
     - Block Explorer: https://explorer.testnet.monad.xyz

2. **Deploy contracts**

```bash
npm run deploy
```

3. **Update .env with contract addresses**
   - Copy the deployed addresses to your `.env` file

## 🎯 How to Use

### For Players

1. **Connect Wallet**

   - Click "Connect Wallet" button
   - Select your preferred wallet (MetaMask, WalletConnect, etc.)

2. **Get METACITY Tokens**

   - Participate in initial distribution
   - Earn through building rewards
   - Stake to earn passive income

3. **Create Proposals**

   - Go to Proposals tab
   - Click "Create Proposal"
   - Choose building type and location
   - Submit proposal (requires 100 METACITY tokens)

4. **Vote on Proposals**

   - Browse active proposals
   - Vote For or Against
   - Your voting power = your token balance

5. **Stake Tokens**

   - Go to Staking tab
   - Enter amount to stake
   - Earn 10% APY
   - Claim rewards anytime

6. **Manage Buildings**
   - View your buildings in Buildings tab
   - Upgrade to increase rewards
   - Claim building rewards

### For Developers

```typescript
// Import contracts
import { CITY_DAO_ADDRESS, BUILDING_NFT_ADDRESS } from "@/lib/contracts";

// Create a proposal
const tx = await cityDAO.createProposal(
  "Build Solar Farm",
  "Eco-friendly energy solution",
  4, // BuildingType.SolarFarm
  10, // x position
  20, // y position
  ethers.parseEther("0.5") // funding
);

// Vote on proposal
await cityDAO.vote(proposalId, true, ethers.parseEther("100"));

// Stake tokens
await rewardsManager.stake(ethers.parseEther("1000"));
```

## 🏆 Hackathon Winning Features

### Innovation

- ✅ First DAO-based city builder game
- ✅ Combines gaming + DeFi + NFTs
- ✅ Sustainability rewards mechanism
- ✅ Fully decentralized governance

### Technical Excellence

- ✅ Clean, modular smart contracts
- ✅ Comprehensive test coverage
- ✅ Modern React architecture
- ✅ Responsive, beautiful UI
- ✅ 3D visualization

### User Experience

- ✅ Intuitive interface
- ✅ Smooth animations
- ✅ Real-time updates
- ✅ Mobile responsive
- ✅ Cyberpunk aesthetics

### Impact

- ✅ Promotes sustainable choices
- ✅ Democratic decision-making
- ✅ Community ownership
- ✅ Economic incentives

## 📊 Tokenomics

### METACITY Token

- **Total Supply**: 10 billion (max)
- **Initial Supply**: 1 billion
- **Minting**: Controlled by RewardsManager
- **Utility**:
  - Governance voting
  - Staking rewards
  - Building purchase
  - Proposal creation

### Reward Distribution

- **Staking APY**: 10%
- **Building Rewards**: Dynamic based on:
  - Building level
  - Sustainability score
  - Economic value
  - Time owned

## 🔒 Security

- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard protection
- ✅ Access control mechanisms
- ✅ Thorough testing
- ✅ Upgradeable architecture ready

## 🎨 Design System

### Colors

- **Cyber Blue**: `#00d4ff` - Primary actions
- **Cyber Purple**: `#b537ff` - Secondary elements
- **Neon Green**: `#39ff14` - Success states
- **Cyber Pink**: `#ff006e` - Highlights

### Typography

- **Headings**: Orbitron (futuristic)
- **Body**: Space Grotesk (modern)

## 📱 Screenshots

### City View

![City View](docs/city-view.png)

### Dashboard

![Dashboard](docs/dashboard.png)

### Proposals

![Proposals](docs/proposals.png)

### Staking

![Staking](docs/staking.png)

## 🗺️ Roadmap

### Phase 1: MVP (Current)

- ✅ Core smart contracts
- ✅ Basic UI
- ✅ Governance system
- ✅ Staking mechanism

### Phase 2: Enhancement

- ⏳ Mobile app
- ⏳ Social features
- ⏳ Achievement system
- ⏳ Multiplayer events

### Phase 3: Scale

- ⏳ Multi-chain deployment
- ⏳ DAO treasury investment strategies
- ⏳ Building marketplace
- ⏳ City wars (competitive mode)

### Phase 4: Ecosystem

- ⏳ Developer SDK
- ⏳ Plugin system
- ⏳ Metaverse integration
- ⏳ Real-world partnerships

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by [Your Name]

## 📞 Contact

- **Twitter**: [@MetaCityDAO](https://twitter.com/metacitydao)
- **Discord**: [Join our community](https://discord.gg/metacity)
- **Email**: contact@metacity.dao

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- RainbowKit for wallet integration
- Three.js community for 3D resources
- Polygon for fast, cheap transactions

---

<div align="center">

**⭐ Star this repo if you like it!**

Made for [Hackathon Name] 2025

</div>
