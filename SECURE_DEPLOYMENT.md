# 🔐 Secure Deployment Guide

## Why No Private Key in .env?

**Security Best Practice**: Never store private keys in files that might be accidentally committed to Git or shared.

## 🚀 How to Deploy (3 Secure Options)

### **Option 1: Interactive Deployment (Recommended)** ⭐

The deployment script will ask for your private key when you run it:

```powershell
npm run deploy
```

**What happens:**

1. Script compiles contracts
2. Prompts you to enter private key
3. Key is used ONLY for deployment
4. Key is NOT saved anywhere
5. Contracts get deployed
6. Addresses are displayed

**Benefits:**

- ✅ Most secure
- ✅ No files to manage
- ✅ Private key never stored

---

### **Option 2: Environment Variable (Temporary)**

Set the private key temporarily in your terminal session:

**Windows PowerShell:**

```powershell
$env:PRIVATE_KEY="your_private_key_without_0x"
npm run deploy
```

**Linux/Mac:**

```bash
export PRIVATE_KEY="your_private_key_without_0x"
npm run deploy
```

**Benefits:**

- ✅ Secure (only in current session)
- ✅ Clears when terminal closes
- ✅ Not saved to disk

---

### **Option 3: Use Hardware Wallet (Advanced)**

For production deployments, use a hardware wallet like Ledger or Trezor with Hardhat.

Install plugin:

```powershell
npm install --save-dev @nomicfoundation/hardhat-ledger
```

Update hardhat.config.js to use Ledger.

---

## 📝 Step-by-Step Deployment

### Before You Start

1. **Get Test Tokens**

   - Join Monad Discord
   - Request MON tokens from faucet
   - Wait for tokens to arrive

2. **Compile Contracts**
   ```powershell
   npm run compile
   ```

### Deploy Using Interactive Method

```powershell
# Run the deployment
npm run deploy
```

**You'll see:**

```
🚀 Deploying MetaCity contracts to Monad Testnet...

⚠️  SECURITY NOTE: Your private key will NOT be saved anywhere.
    It's only used for this deployment session.

💡 No private key found in .env file (this is more secure!)
🔐 Enter your private key (won't be saved): _
```

**Enter your private key** (paste from MetaMask)

**To get your private key from MetaMask:**

1. Open MetaMask
2. Click the 3 dots (⋮) next to your account
3. Click "Account Details"
4. Click "Show Private Key"
5. Enter your password
6. Copy the private key
7. Paste it in the terminal (won't be visible)
8. Press Enter

**Deployment continues:**

```
📍 Deploying from address: 0x...
💰 Balance: 10.5 MON

📝 Deploying MetaCityToken...
✅ MetaCityToken deployed to: 0x...

🏗️ Deploying BuildingNFT...
✅ BuildingNFT deployed to: 0x...

🏛️ Deploying CityDAO...
✅ CityDAO deployed to: 0x...

💰 Deploying RewardsManager...
✅ RewardsManager deployed to: 0x...

🎉 Deployment Complete!
```

### After Deployment

1. **Copy Contract Addresses**

   The script will output something like:

   ```
   NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=0x1234...
   NEXT_PUBLIC_BUILDING_NFT_ADDRESS=0x5678...
   NEXT_PUBLIC_CITY_DAO_ADDRESS=0x9abc...
   NEXT_PUBLIC_REWARDS_ADDRESS=0xdef0...
   ```

2. **Update .env File**

   Open `.env` and paste the addresses:

   ```env
   NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=0x1234...
   NEXT_PUBLIC_BUILDING_NFT_ADDRESS=0x5678...
   NEXT_PUBLIC_CITY_DAO_ADDRESS=0x9abc...
   NEXT_PUBLIC_REWARDS_ADDRESS=0xdef0...
   ```

3. **Start the App**

   ```powershell
   npm run dev
   ```

4. **Visit http://localhost:3000** 🎉

---

## 🔒 Security Tips

### DO ✅

- ✅ Use interactive deployment (Option 1)
- ✅ Use temporary environment variables
- ✅ Clear your terminal history after deployment
- ✅ Use hardware wallets for mainnet
- ✅ Keep your seed phrase secure

### DON'T ❌

- ❌ Store private keys in .env (we removed this!)
- ❌ Commit private keys to Git
- ❌ Share your private key with anyone
- ❌ Use the same key for testnet and mainnet
- ❌ Take screenshots with private keys visible

---

## 🐛 Troubleshooting

### "Insufficient funds"

- Make sure you have test MON tokens
- Check balance: Visit https://explorer.testnet.monad.xyz
- Request more from Monad faucet

### "Invalid private key"

- Make sure to remove "0x" prefix
- Copy the full key (64 characters)
- Check for extra spaces

### "Network error"

- Verify RPC URL in .env: `https://testnet-rpc.monad.xyz`
- Check Monad testnet status
- Wait a few minutes and retry

### "Contract deployment failed"

- Ensure contracts compile: `npm run compile`
- Check gas price settings
- Verify network connection

---

## 🎯 Quick Reference

### Deploy Command

```powershell
npm run deploy
```

### Check Balance

Visit: https://explorer.testnet.monad.xyz
Paste your address

### View Transactions

After deployment, check the block explorer for your deployed contracts

### Get Test Tokens

Join Monad Discord → Faucet channel

---

## 📞 Need Help?

- **Monad Discord**: Check official Monad channels
- **Documentation**: See README.md
- **Issues**: Contract compilation errors? Run `npm run compile` first

---

**Your private key stays private! 🔐**

Deploy securely and build amazing things! 🚀
