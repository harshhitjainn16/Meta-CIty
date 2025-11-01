# 🔐 Wallet Setup Guide

This guide will help you add your wallet to the MetaCity project.

## Two Ways to Add Your Wallet

There are two main scenarios where you'll use your wallet:

1. **Connecting Your Wallet in the App** (for users) - Requires WalletConnect Project ID
2. **Deploying Smart Contracts** (for developers) - Requires private key

---

## 📱 Option 1: Connect Wallet in the App UI

This allows users to connect their MetaMask, WalletConnect, or other wallets through the app.

### Step 1: Get WalletConnect Project ID

1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in
3. Click **"Create New Project"**
4. Fill in the project details:
   - **Project Name**: MetaCity DAO (or any name)
   - **Homepage URL**: http://localhost:3000 (or your domain)
   - **Allowed Domains**: localhost (for development)
5. Click **"Create"**
6. Copy your **Project ID** (it looks like: `abc123def456...`)

### Step 2: Create .env File

1. Copy the example file:
   ```powershell
   copy .env.example .env
   ```

2. Open `.env` in a text editor

3. Replace `YOUR_WALLETCONNECT_PROJECT_ID` with your actual Project ID:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_actual_project_id_here
   ```

### Step 3: Test the Connection

1. Start the development server:
   ```powershell
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Click the **"Connect Wallet"** button in the header

4. You should see wallet options like:
   - MetaMask
   - WalletConnect
   - Coinbase Wallet
   - And more...

5. Select your preferred wallet and connect!

---

## 🚀 Option 2: Deploy Smart Contracts with Your Wallet

This is for deploying the smart contracts to Monad Testnet.

### Secure Method (Recommended) ⭐

The project uses an interactive deployment that prompts for your private key securely:

1. Make sure you have testnet tokens (MON) in your wallet
   - Get MON from Monad Testnet Faucet (check Monad Discord)

2. Run the deployment:
   ```powershell
   npm run deploy
   ```

3. When prompted, enter your private key:
   - The key won't be displayed as you type (for security)
   - The key is NOT saved anywhere
   - It's only used for this deployment

4. The contracts will be deployed and addresses displayed

**How to get your private key from MetaMask:**
- Open MetaMask
- Click the 3 dots (⋮) next to your account
- Click "Account Details"
- Click "Show Private Key"
- Enter your password
- Copy the private key (remove the `0x` prefix if present)

### Alternative: Temporary Environment Variable

If you prefer to use an environment variable (temporary session only):

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

⚠️ **Important**: This only works for the current terminal session. The key is cleared when you close the terminal.

### Not Recommended: Adding to .env File

While you *can* add your private key to `.env`, it's **NOT recommended** for security reasons:
- Private keys should never be stored in files
- Risk of accidentally committing to Git
- Security vulnerability

The interactive method is safer and just as easy!

---

## ✅ Quick Checklist

- [ ] Get WalletConnect Project ID from cloud.walletconnect.com
- [ ] Create `.env` file from `.env.example`
- [ ] Add your WalletConnect Project ID to `.env`
- [ ] Test wallet connection in the app (click "Connect Wallet")
- [ ] (Optional) Get MON testnet tokens for deployment
- [ ] (Optional) Deploy contracts using `npm run deploy`

---

## 🆘 Troubleshooting

### "Connect Wallet" button doesn't work

- Make sure you've added `NEXT_PUBLIC_PROJECT_ID` to your `.env` file
- Restart the dev server after changing `.env`: Stop (Ctrl+C) and run `npm run dev` again
- Clear browser cache and reload the page

### Deployment fails with "insufficient balance"

- Get testnet tokens from Monad Faucet
- Make sure you're connected to Monad Testnet in MetaMask
- Verify your wallet address has MON tokens

### Can't find WalletConnect Project ID

- Make sure you're logged into [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Check your project dashboard
- Create a new project if needed

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files to Git
- ✅ Never share your private key
- ✅ Use the interactive deployment method
- ✅ Store seed phrases securely offline
- ✅ Only use testnet for testing
- ❌ Don't store private keys in files
- ❌ Don't share your private key in chat/messages

---

## 📚 Additional Resources

- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Monad Testnet Setup Guide](./MONAD_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)

