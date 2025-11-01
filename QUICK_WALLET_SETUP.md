# 🚀 Quick Wallet Connection Setup Guide

This guide will walk you through **exactly** where to get your WalletConnect Project ID and how to set it up.

---

## 📍 Step-by-Step: Getting Your WalletConnect Project ID

### Step 1: Go to WalletConnect Cloud

1. **Open your web browser**
2. **Go to:** https://cloud.walletconnect.com
3. **Sign up or Log in:**
   - If you don't have an account, click **"Sign Up"**
   - You can sign up with:
     - Email
     - GitHub
     - Google
   - If you already have an account, click **"Log In"**

### Step 2: Create a New Project

1. **After logging in**, you'll see the dashboard
2. **Click the big button** that says **"Create New Project"** (usually at the top or center)
3. **Fill in the form:**

   ```
   Project Name: MetaCity DAO
   (You can use any name you want)
   
   Homepage URL: http://localhost:3000
   (For development - change to your domain later for production)
   
   Allowed Domains: localhost
   (Type: localhost)
   ```

4. **Click "Create"** button

### Step 3: Copy Your Project ID

1. **After creating the project**, you'll see your project dashboard
2. **Look for "Project ID"** - it's usually at the top of the page
   - It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - It's a long string of letters and numbers (usually 32+ characters)
3. **Click the copy button** next to it, or select and copy it
4. **Save it somewhere safe** (you'll need it in the next step)

---

## 🔧 Step-by-Step: Setting Up Your .env File

### Step 1: Create the .env File

1. **Open PowerShell** in your project folder (you're already there!)
2. **Copy the example file:**

   ```powershell
   copy .env.example .env
   ```

3. **Verify it was created:**
   ```powershell
   dir .env
   ```
   (You should see `.env` listed)

### Step 2: Open and Edit the .env File

1. **Open `.env` in any text editor:**
   - **Option A:** Right-click `.env` → Open with → Notepad
   - **Option B:** Open in VS Code: `code .env`
   - **Option C:** Use PowerShell: `notepad .env`

2. **Find this line:**
   ```
   NEXT_PUBLIC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
   ```

3. **Replace** `YOUR_WALLETCONNECT_PROJECT_ID` **with your actual Project ID:**

   ```
   NEXT_PUBLIC_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
   
   (Use the Project ID you copied from WalletConnect Cloud)

4. **Save the file** (Ctrl+S)

### Step 3: Verify Your Setup

Your `.env` file should now look like this:

```env
# WalletConnect Configuration
NEXT_PUBLIC_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=10143
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz

# Contract Addresses (leave empty for now)
# NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=
# NEXT_PUBLIC_BUILDING_NFT_ADDRESS=
# NEXT_PUBLIC_CITY_DAO_ADDRESS=
# NEXT_PUBLIC_REWARDS_ADDRESS=
```

---

## ✅ Step-by-Step: Testing Your Wallet Connection

### Step 1: Start the Development Server

1. **In PowerShell**, make sure you're in the project folder:
   ```powershell
   cd C:\Users\Admin\Desktop\Meta-CIty
   ```

2. **Install dependencies** (if you haven't already):
   ```powershell
   npm install
   ```

3. **Start the server:**
   ```powershell
   npm run dev
   ```

4. **Wait for it to start** - you'll see:
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   ```

### Step 2: Open the App in Browser

1. **Open your web browser**
2. **Go to:** http://localhost:3000
3. **You should see the MetaCity app loading**

### Step 3: Connect Your Wallet

1. **Look at the top right** of the page
2. **Click the "Connect Wallet" button**
3. **You should see a modal/popup** with wallet options:
   - 🦊 MetaMask
   - 🔷 WalletConnect
   - 💰 Coinbase Wallet
   - And more...

4. **Choose your wallet:**
   - **If you have MetaMask installed:** Click "MetaMask"
   - **If you want to use WalletConnect:** Click "WalletConnect"
   - **If you have another wallet:** Choose it from the list

5. **Follow the prompts** to connect:
   - MetaMask will open and ask you to approve
   - WalletConnect will show a QR code
   - Other wallets will have their own process

6. **Once connected**, you should see your wallet address in the top right!

---

## 🎯 Quick Checklist

Follow these steps in order:

- [ ] **Step 1:** Go to https://cloud.walletconnect.com
- [ ] **Step 2:** Sign up or log in
- [ ] **Step 3:** Click "Create New Project"
- [ ] **Step 4:** Fill in the form (Project Name: MetaCity DAO, Homepage: http://localhost:3000)
- [ ] **Step 5:** Copy your Project ID (long string of letters/numbers)
- [ ] **Step 6:** Run `copy .env.example .env` in PowerShell
- [ ] **Step 7:** Open `.env` file in a text editor
- [ ] **Step 8:** Replace `YOUR_WALLETCONNECT_PROJECT_ID` with your actual Project ID
- [ ] **Step 9:** Save the `.env` file
- [ ] **Step 10:** Run `npm run dev` to start the server
- [ ] **Step 11:** Open http://localhost:3000 in your browser
- [ ] **Step 12:** Click "Connect Wallet" button
- [ ] **Step 13:** Select your wallet and connect!

---

## ❓ Troubleshooting

### Problem: "Connect Wallet" button doesn't show wallet options

**Solution:**
- Make sure you added the Project ID to `.env` file
- Restart the dev server (stop with Ctrl+C, then run `npm run dev` again)
- Make sure the Project ID doesn't have quotes around it
- Clear your browser cache and reload

### Problem: Can't find Project ID in WalletConnect Cloud

**Solution:**
- Make sure you're logged in
- Check the project dashboard - it should be at the top
- If you can't find it, create a new project
- The Project ID is usually displayed prominently after creating a project

### Problem: "Invalid Project ID" error

**Solution:**
- Make sure you copied the entire Project ID (it's long!)
- Don't include any spaces or line breaks
- Make sure there's no `YOUR_WALLETCONNECT_PROJECT_ID` text left in the file
- The format should be: `NEXT_PUBLIC_PROJECT_ID=your_actual_id_here`

### Problem: Wallet connection popup doesn't appear

**Solution:**
- Make sure you've saved the `.env` file after editing
- Restart the dev server completely
- Try in a different browser (Chrome, Firefox, Edge)
- Make sure you're using http://localhost:3000 (not https)

---

## 🎉 That's It!

Once you complete these steps, your wallet connection should work perfectly! The app will be able to connect to MetaMask, WalletConnect, and other supported wallets.

**Need more help?** Check the full guide: `WALLET_SETUP.md`

