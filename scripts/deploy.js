const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MetaCity contracts...");

  // Deploy MetaCityToken
  console.log("\n📝 Deploying MetaCityToken...");
  const MetaCityToken = await hre.ethers.getContractFactory("MetaCityToken");
  const token = await MetaCityToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ MetaCityToken deployed to:", tokenAddress);

  // Deploy BuildingNFT
  console.log("\n🏗️ Deploying BuildingNFT...");
  const BuildingNFT = await hre.ethers.getContractFactory("BuildingNFT");
  const buildingNFT = await BuildingNFT.deploy();
  await buildingNFT.waitForDeployment();
  const buildingNFTAddress = await buildingNFT.getAddress();
  console.log("✅ BuildingNFT deployed to:", buildingNFTAddress);

  // Deploy CityDAO
  console.log("\n🏛️ Deploying CityDAO...");
  const CityDAO = await hre.ethers.getContractFactory("CityDAO");
  const cityDAO = await CityDAO.deploy(tokenAddress, buildingNFTAddress);
  await cityDAO.waitForDeployment();
  const cityDAOAddress = await cityDAO.getAddress();
  console.log("✅ CityDAO deployed to:", cityDAOAddress);

  // Deploy RewardsManager
  console.log("\n💰 Deploying RewardsManager...");
  const RewardsManager = await hre.ethers.getContractFactory("RewardsManager");
  const rewardsManager = await RewardsManager.deploy(tokenAddress, buildingNFTAddress);
  await rewardsManager.waitForDeployment();
  const rewardsManagerAddress = await rewardsManager.getAddress();
  console.log("✅ RewardsManager deployed to:", rewardsManagerAddress);

  // Setup permissions
  console.log("\n🔧 Setting up permissions...");
  
  // Add RewardsManager as minter
  await token.addMinter(rewardsManagerAddress);
  console.log("✅ RewardsManager added as token minter");
  
  // Add CityDAO as authorized minter for BuildingNFT
  await buildingNFT.setAuthorizedMinter(cityDAOAddress, true);
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
