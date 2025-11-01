# 🚀 MetaCity Deployment Guide

## Quick Deploy Checklist

### Before Deployment

- [ ] Install all dependencies: `npm install`
- [ ] Get testnet tokens from Monad Faucet
- [ ] Get WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- [ ] Create `.env` file from `.env.example`
- [ ] Compile contracts: `npm run compile`

### Step 1: Deploy Smart Contracts

```bash
# Deploy to Monad Testnet
npm run deploy

# Or specify network explicitly
npx hardhat run scripts/deploy.js --network monadTestnet
```

**Expected output:**

```
🚀 Deploying MetaCity contracts...
✅ MetaCityToken deployed to: 0x...
✅ BuildingNFT deployed to: 0x...
✅ CityDAO deployed to: 0x...
✅ RewardsManager deployed to: 0x...
```

### Step 2: Update Environment Variables

Copy the deployed addresses to your `.env`:

```env
NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_BUILDING_NFT_ADDRESS=0x...
NEXT_PUBLIC_CITY_DAO_ADDRESS=0x...
NEXT_PUBLIC_REWARDS_ADDRESS=0x...
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CHAIN_ID=10143
```

### Step 3: Deploy Frontend

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Add Environment Variables in Vercel Dashboard**

   - Go to your project settings
   - Add all `NEXT_PUBLIC_*` variables

4. **Redeploy**

```bash
vercel --prod
```

#### Option B: Build Locally

```bash
npm run build
npm start
```

## Testing Locally

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start Next.js dev server
npm run dev
```

## Network Configuration

### Monad Testnet

- **Chain ID**: 10143
- **RPC**: https://testnet-rpc.monad.xyz
- **Explorer**: https://explorer.testnet.monad.xyz
- **Faucet**: Check Monad Discord community
- **Currency**: MON

## Troubleshooting

### "Insufficient funds" error

- Get testnet tokens from the faucet
- Wait 30 seconds and try again

### "Network not supported"

- Check your MetaMask is connected to the right network
- Verify `NEXT_PUBLIC_CHAIN_ID` in `.env`

### "Contract not deployed"

- Ensure you've deployed smart contracts first
- Verify contract addresses in `.env`

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## Demo Script for Hackathon Judges

### 1. Connect Wallet (30 seconds)

- Show MetaMask connection
- Display wallet balance
- Point out multi-wallet support (RainbowKit)

### 2. City View (1 minute)

- Navigate to 3D city visualization
- Demonstrate interactive controls
- Highlight cyberpunk aesthetics
- Show existing buildings

### 3. Dashboard (1 minute)

- Display real-time statistics
- Show charts and analytics
- Highlight leaderboard
- Explain sustainability metrics

### 4. Create Proposal (2 minutes)

- Go to Proposals tab
- Click "Create Proposal"
- Fill in building details (Solar Farm)
- Emphasize sustainability score
- Submit proposal

### 5. Voting (1 minute)

- Show active proposals
- Cast vote with tokens
- Display voting progress
- Explain quorum mechanism

### 6. Staking (1.5 minutes)

- Navigate to Staking tab
- Show staking interface
- Enter stake amount
- Display APY calculation
- Claim rewards demo

### 7. Buildings NFT (1 minute)

- Go to Buildings gallery
- Show NFT collection
- Display building stats
- Demonstrate upgrade feature
- Claim building rewards

### 8. Technical Highlights (30 seconds)

- Open browser console for contract interactions
- Show transaction confirmations
- Mention gas optimization
- Point out security features

## Performance Optimization

### Smart Contracts

- ✅ Optimized for gas efficiency
- ✅ Batch operations where possible
- ✅ Events for off-chain tracking

### Frontend

- ✅ Code splitting
- ✅ Image optimization
- ✅ Dynamic imports for 3D components
- ✅ Lazy loading

## Security Checklist

- ✅ Private keys never committed
- ✅ Environment variables properly set
- ✅ RPC endpoints secured
- ✅ Contract ownership configured
- ✅ ReentrancyGuard on critical functions

## Post-Deployment

### Test on Testnet

1. Connect wallet to Polygon Amoy
2. Get test tokens
3. Try each feature:
   - Stake tokens
   - Create proposal
   - Vote on proposal
   - Mint building (via passed proposal)
   - Claim rewards

### Monitor

- Check contract on block explorer
- Verify all functions work
- Test on multiple devices
- Check mobile responsiveness

## Support

Need help? Check:

- [Documentation](./README.md)
- [Hardhat Docs](https://hardhat.org)
- [Next.js Docs](https://nextjs.org/docs)
- [Polygon Docs](https://docs.polygon.technology)

## Submission Checklist

- [ ] Code deployed and working
- [ ] README.md complete
- [ ] Demo video recorded
- [ ] Screenshots added
- [ ] Project submitted
- [ ] Contract verified on explorer
- [ ] Live demo link working

---

**Good luck with your hackathon! 🚀**
