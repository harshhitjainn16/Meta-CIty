# 🟣 Adding Monad Testnet to MetaMask

## Quick Setup Guide

### Method 1: Manual Addition (Recommended)

1. **Open MetaMask**

   - Click on the network dropdown (top of MetaMask)
   - Click "Add Network"

2. **Enter Network Details**

   ```
   Network Name: Monad Testnet
   RPC URL: https://testnet-rpc.monad.xyz
   Chain ID: 10143
   Currency Symbol: MON
   Block Explorer URL: https://explorer.testnet.monad.xyz
   ```

3. **Save and Switch**
   - Click "Save"
   - Switch to Monad Testnet

### Method 2: One-Click Add (If Available)

Visit the Monad documentation or Discord for the latest network addition links.

## Getting Test Tokens

### Option 1: Monad Discord Faucet

1. Join Monad Discord: [Check official Monad website]
2. Navigate to faucet channel
3. Request test MON tokens
4. Paste your wallet address

### Option 2: Direct Faucet (If Available)

Check Monad's official documentation for the testnet faucet URL.

## Verify Connection

1. **Check Network**

   - MetaMask should show "Monad Testnet"
   - Chain ID: 10143

2. **Test Transaction**

   - Once you have test MON, try sending a small amount to yourself
   - This confirms the network is working

3. **View on Explorer**
   - Go to https://explorer.testnet.monad.xyz
   - Paste your address to see transactions

## Network Information

| Parameter           | Value                              |
| ------------------- | ---------------------------------- |
| **Network Name**    | Monad Testnet                      |
| **RPC URL**         | https://testnet-rpc.monad.xyz      |
| **Chain ID**        | 10143 (0x279F in hex)              |
| **Currency Symbol** | MON                                |
| **Decimals**        | 18                                 |
| **Block Explorer**  | https://explorer.testnet.monad.xyz |

## Troubleshooting

### "RPC Error" or "Network Timeout"

- Monad testnet might be experiencing high traffic
- Wait a few minutes and try again
- Check Monad Discord for network status updates

### "Insufficient Funds"

- Make sure you've requested test tokens from the faucet
- Wait a few minutes after requesting (faucet might have delays)
- Check your balance on the block explorer

### "Wrong Network"

- Double-check the Chain ID is 10143
- Ensure RPC URL is correct
- Try removing and re-adding the network

## Important Notes

⚠️ **This is a Testnet**

- Tokens have NO real value
- Use ONLY for testing
- Do NOT send real funds to testnet addresses

🔒 **Security**

- Never share your private key
- Testnet and mainnet use the same private key - be careful!
- Keep your seed phrase secure

📚 **Resources**

- Official Monad Docs: [Check Monad website]
- Discord Community: [Join via official links]
- GitHub: [Monad repositories]

## For MetaCity Development

Once you have Monad Testnet configured and test MON tokens:

1. **Update .env file**

   ```env
   NEXT_PUBLIC_CHAIN_ID=10143
   PRIVATE_KEY=your_private_key_here
   ```

2. **Deploy Contracts**

   ```bash
   npm run deploy
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Why Monad?

✅ **High Performance** - Monad is built for speed
✅ **EVM Compatible** - Works with existing Ethereum tools
✅ **Low Costs** - Efficient transaction processing
✅ **Innovation** - Cutting-edge blockchain technology

---

**Ready to build on Monad? Let's go! 🚀**
