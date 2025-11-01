# 🎯 Quick Start Guide for MetaCity

## Welcome! 👋

This guide will get you from zero to running MetaCity in under 10 minutes.

## ⚡ Super Quick Start (3 steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy the example env file
copy .env.example .env

# Edit .env and add your WalletConnect Project ID
# Get one free at: https://cloud.walletconnect.com
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## 🔧 What You Have

### Smart Contracts ✅

- **MetaCityToken.sol** - ERC20 governance token
- **BuildingNFT.sol** - ERC721 building NFTs
- **CityDAO.sol** - Governance and voting
- **RewardsManager.sol** - Staking and rewards

### Frontend ✅

- **3D City View** - Interactive Three.js scene
- **Dashboard** - Analytics and statistics
- **Proposals** - Create and vote on proposals
- **Staking** - Stake tokens, earn rewards
- **Buildings** - View and manage NFTs

## 🚀 Deployment to Testnet

### Step 1: Get Test Tokens

1. Join Monad Discord community
2. Request MON tokens from the faucet
3. Add Monad Testnet to MetaMask:
   - Network Name: Monad Testnet
   - RPC URL: https://testnet-rpc.monad.xyz
   - Chain ID: 10143
   - Currency Symbol: MON

### Step 2: Deploy Contracts

```bash
# Make sure you have test MON
npm run deploy
```

This will:

- Deploy all 4 smart contracts
- Set up permissions
- Give you contract addresses

### Step 3: Update .env

Copy the contract addresses from the deploy output to your `.env` file.

## 🎮 Testing Features

### Test Staking

1. Go to Staking tab
2. Enter amount (e.g., 100)
3. Click "Stake Tokens"
4. Watch your rewards grow!

### Test Proposals

1. Go to Proposals tab
2. Click "Create Proposal"
3. Fill in details
4. Vote on proposals

### Test 3D City

1. Go to City View
2. Drag to rotate
3. Scroll to zoom
4. Click buildings

## 📚 File Structure

```
metacity-dao/
├── contracts/          # Solidity smart contracts
│   ├── MetaCityToken.sol
│   ├── BuildingNFT.sol
│   ├── CityDAO.sol
│   └── RewardsManager.sol
├── scripts/           # Deployment scripts
│   └── deploy.js
├── pages/            # Next.js pages
│   ├── index.tsx     # Main app
│   ├── _app.tsx      # App wrapper
│   └── _document.tsx # HTML document
├── components/       # React components
│   ├── Header.tsx
│   ├── CityScene.tsx
│   ├── Dashboard.tsx
│   ├── ProposalsList.tsx
│   ├── StakingPanel.tsx
│   └── BuildingsGallery.tsx
├── lib/             # Utilities
│   ├── wagmi.ts     # Web3 config
│   └── contracts.ts # Contract ABIs
├── styles/          # CSS styles
│   └── globals.css
└── hardhat.config.js # Hardhat config
```

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run compile    # Compile smart contracts
npm run deploy     # Deploy contracts to testnet
npm run test       # Run smart contract tests
```

## 🎨 Customization Ideas

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'cyber-blue': '#YOUR_COLOR',
  'cyber-purple': '#YOUR_COLOR',
  // ...
}
```

### Add New Building Types

Edit `lib/contracts.ts`:

```typescript
export const BUILDING_TYPES = [
  // Add your new building type
  { id: 8, name: "Your Building", icon: "🏰", color: "#COLOR" },
];
```

### Modify Token Economics

Edit `contracts/RewardsManager.sol`:

```solidity
uint256 public constant DAILY_STAKE_RATE = 10; // Change APY
```

## 🐛 Common Issues

### "Cannot find module" errors

```bash
npm install
```

### Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001
```

### MetaMask not connecting

1. Check you're on the right network
2. Clear MetaMask cache
3. Refresh page

### Deployment fails

1. Make sure you have test MATIC
2. Check your private key in .env
3. Verify RPC URL is correct

## 💡 Tips for Hackathon Demo

### 1. Prepare Your Wallet

- Have test tokens ready
- Pre-stake some tokens
- Create a proposal beforehand

### 2. Show Key Features

- Start with 3D city view (visual impact!)
- Show governance in action
- Demonstrate staking rewards
- Display analytics dashboard

### 3. Highlight Innovation

- DAO governance for gaming
- Sustainability rewards
- NFT utility (not just collectibles)
- DeFi integration

### 4. Technical Points

- Mention Monad for high performance and low fees
- Show smart contract architecture
- Point out security features
- Discuss scalability

## 📊 Demo Talking Points

**Opening (30 sec)**

> "MetaCity is a DAO-based city builder where players collaboratively build a virtual city through democratic voting. Each building is an NFT that generates rewards."

**Governance (1 min)**

> "Anyone can propose new buildings. Token holders vote. Passed proposals automatically mint building NFTs from the treasury."

**Economics (1 min)**

> "Stake tokens for 10% APY. Buildings generate rewards based on sustainability and economic value. Green buildings earn more."

**Technology (30 sec)**

> "Built with Solidity smart contracts on Monad, Next.js frontend, and Three.js for 3D visualization."

## 🎯 Next Steps

1. ✅ Run the project locally
2. ✅ Deploy to testnet
3. ✅ Test all features
4. ✅ Customize branding
5. ✅ Add your innovations
6. ✅ Create demo video
7. ✅ Submit to hackathon!

## 🆘 Need Help?

- Check [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Review smart contracts in `contracts/` folder
- Test with `npm run test`

## 🌟 Make It Yours!

This is a complete, working project. Now add your unique twist:

- Custom building types
- New game mechanics
- Additional DeFi features
- Social features
- Achievements system
- Multiplayer events

**Good luck with your hackathon! You've got this! 🚀**

---

Need clarification? Every file has comments explaining what it does. Happy hacking! 💻
