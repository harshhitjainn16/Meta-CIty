const hre = require("hardhat");
const readline = require("readline");

// Create interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for private key securely
function promptPrivateKey() {
  return new Promise((resolve) => {
    rl.question("\n🔐 Enter your private key (won't be saved): ", (answer) => {
      rl.close();
      // Remove 0x prefix if present
      const key = answer.trim().replace("0x", "");
      resolve(key);
    });
  });
}

async function main() {
  console.log("🚀 Deploying MetaCity contracts to Monad Testnet...");
  console.log(
    "\n⚠️  SECURITY NOTE: Your private key will NOT be saved anywhere."
  );
  console.log("    It's only used for this deployment session.\n");

  // Check if private key is in environment (optional)
  let privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.log("💡 No private key found in .env file (this is more secure!)");
    privateKey = await promptPrivateKey();

    if (
      !privateKey ||
      privateKey === "your_private_key_here_without_0x_prefix"
    ) {
      console.log("\n❌ No valid private key provided. Exiting...");
      console.log("💡 Alternative: Export private key temporarily:");
      console.log('   Windows: $env:PRIVATE_KEY="your_key_here"');
      console.log('   Linux/Mac: export PRIVATE_KEY="your_key_here"');
      process.exit(1);
    }
  }

  // Set up wallet with the private key
  const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);
  console.log("\n📍 Deploying from address:", wallet.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(wallet.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "MON");

  if (balance === 0n) {
    console.log(
      "\n❌ Insufficient balance! Get test tokens from Monad faucet first."
    );
    process.exit(1);
  }

  console.log("\n" + "=".repeat(50));

  // Deploy MetaCityToken
  console.log("\n📝 Deploying MetaCityToken...");
  const MetaCityToken = await hre.ethers.getContractFactory(
    "MetaCityToken",
    wallet
  );
  const token = await MetaCityToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ MetaCityToken deployed to:", tokenAddress);

  // Deploy BuildingNFT
  console.log("\n🏗️ Deploying BuildingNFT...");
  const BuildingNFT = await hre.ethers.getContractFactory(
    "BuildingNFT",
    wallet
  );
  const buildingNFT = await BuildingNFT.deploy();
  await buildingNFT.waitForDeployment();
  const buildingNFTAddress = await buildingNFT.getAddress();
  console.log("✅ BuildingNFT deployed to:", buildingNFTAddress);

  // Deploy CityDAO
  console.log("\n🏛️ Deploying CityDAO...");
  const CityDAO = await hre.ethers.getContractFactory("CityDAO", wallet);
  const cityDAO = await CityDAO.deploy(tokenAddress, buildingNFTAddress);
  await cityDAO.waitForDeployment();
  const cityDAOAddress = await cityDAO.getAddress();
  console.log("✅ CityDAO deployed to:", cityDAOAddress);

  // Deploy RewardsManager
  console.log("\n💰 Deploying RewardsManager...");
  const RewardsManager = await hre.ethers.getContractFactory(
    "RewardsManager",
    wallet
  );
  const rewardsManager = await RewardsManager.deploy(
    tokenAddress,
    buildingNFTAddress
  );
  await rewardsManager.waitForDeployment();
  const rewardsManagerAddress = await rewardsManager.getAddress();
  console.log("✅ RewardsManager deployed to:", rewardsManagerAddress);

  // Setup permissions
  console.log("\n🔧 Setting up permissions...");

  // Add RewardsManager as minter
  await token.connect(wallet).addMinter(rewardsManagerAddress);
  console.log("✅ RewardsManager added as token minter");

  // Add CityDAO as authorized minter for BuildingNFT
  await buildingNFT.connect(wallet).setAuthorizedMinter(cityDAOAddress, true);
  console.log("✅ CityDAO authorized to mint buildings");

  console.log("\n\n🎉 Deployment Complete!");
  console.log("\n📋 Contract Addresses:");
  console.log("====================================");
  console.log("MetaCityToken:", tokenAddress);
  console.log("BuildingNFT:", buildingNFTAddress);
  console.log("CityDAO:", cityDAOAddress);
  console.log("RewardsManager:", rewardsManagerAddress);
  console.log("====================================");
  console.log("\n💡 Add these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_METACITY_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_BUILDING_NFT_ADDRESS=${buildingNFTAddress}`);
  console.log(`NEXT_PUBLIC_CITY_DAO_ADDRESS=${cityDAOAddress}`);
  console.log(`NEXT_PUBLIC_REWARDS_ADDRESS=${rewardsManagerAddress}`);
  console.log(
    "\n🔒 Your private key was NOT saved and will be cleared from memory."
  );
}

main()
  .then(() => {
    console.log("\n✅ Deployment script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
