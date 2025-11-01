export const METACITY_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_METACITY_TOKEN_ADDRESS || '';
export const BUILDING_NFT_ADDRESS = process.env.NEXT_PUBLIC_BUILDING_NFT_ADDRESS || '';
export const CITY_DAO_ADDRESS = process.env.NEXT_PUBLIC_CITY_DAO_ADDRESS || '';
export const REWARDS_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_ADDRESS || '';

export const BUILDING_TYPES = [
  { id: 0, name: 'Residential', icon: '🏠', color: '#4CAF50', sustainability: 50, economic: 500 },
  { id: 1, name: 'Commercial', icon: '🏢', color: '#2196F3', sustainability: 40, economic: 1000 },
  { id: 2, name: 'Industrial', icon: '🏭', color: '#FF9800', sustainability: 30, economic: 900 },
  { id: 3, name: 'Park', icon: '🌳', color: '#8BC34A', sustainability: 100, economic: 400 },
  { id: 4, name: 'Solar Farm', icon: '☀️', color: '#FFC107', sustainability: 95, economic: 700 },
  { id: 5, name: 'Hospital', icon: '🏥', color: '#F44336', sustainability: 60, economic: 800 },
  { id: 6, name: 'School', icon: '🏫', color: '#9C27B0', sustainability: 65, economic: 600 },
  { id: 7, name: 'Recycling Center', icon: '♻️', color: '#00BCD4', sustainability: 90, economic: 550 },
];

export const CONTRACT_ABIS = {
  MetaCityToken: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
  ],
  BuildingNFT: [
    'function mintBuilding(address to, uint8 buildingType, uint256 x, uint256 y, string uri) returns (uint256)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner) view returns (uint256)',
    'function buildings(uint256 tokenId) view returns (uint8 buildingType, uint256 level, uint256 sustainabilityScore, uint256 economicValue, uint256 createdAt, address builder, uint256 x, uint256 y)',
    'function upgradeBuilding(uint256 tokenId)',
  ],
  CityDAO: [
    'function createProposal(string title, string description, uint8 buildingType, uint256 x, uint256 y, uint256 fundingRequired) returns (uint256)',
    'function vote(uint256 proposalId, bool support, uint256 amount)',
    'function executeProposal(uint256 proposalId)',
    'function proposals(uint256 proposalId) view returns (uint256 id, address proposer, string title, string description, uint8 buildingType, uint256 x, uint256 y, uint256 fundingRequired, uint256 votesFor, uint256 votesAgainst, uint256 startTime, uint256 endTime, bool executed, bool passed)',
    'function proposalCount() view returns (uint256)',
    'function depositToTreasury() payable',
    'function treasury() view returns (uint256 balance, uint256 totalDeposits, uint256 totalWithdrawals)',
  ],
  RewardsManager: [
    'function stake(uint256 amount)',
    'function unstake(uint256 amount)',
    'function claimStakeRewards()',
    'function claimBuildingRewards(uint256 tokenId)',
    'function calculateStakeRewards(address user) view returns (uint256)',
    'function calculateBuildingRewards(uint256 tokenId) view returns (uint256)',
    'function getStakeInfo(address user) view returns (uint256 amount, uint256 startTime, uint256 pendingRewards, uint256 totalRewards)',
    'function totalStaked() view returns (uint256)',
  ],
};
