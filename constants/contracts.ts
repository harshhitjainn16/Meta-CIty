/**
 * Contract Addresses and ABIs
 */

export const CONTRACT_ADDRESSES = {
  token: process.env.NEXT_PUBLIC_METACITY_TOKEN_ADDRESS || '',
  buildingNFT: process.env.NEXT_PUBLIC_BUILDING_NFT_ADDRESS || '',
  cityDAO: process.env.NEXT_PUBLIC_CITY_DAO_ADDRESS || '',
  rewardsManager: process.env.NEXT_PUBLIC_REWARDS_ADDRESS || '',
} as const;

export const CONTRACT_ABIS = {
  MetaCityToken: [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function mint(address to, uint256 amount)',
  ],
  BuildingNFT: [
    'function mintBuilding(address to, uint8 buildingType, uint256 x, uint256 y, string uri) returns (uint256)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    'function buildings(uint256 tokenId) view returns (uint8 buildingType, uint256 level, uint256 sustainabilityScore, uint256 economicValue, uint256 createdAt, address builder, uint256 x, uint256 y)',
    'function upgradeBuilding(uint256 tokenId)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'event BuildingMinted(uint256 indexed tokenId, address indexed owner, uint8 buildingType, uint256 x, uint256 y)',
    'event BuildingUpgraded(uint256 indexed tokenId, uint256 newLevel)',
  ],
  CityDAO: [
    'function createProposal(string title, string description, uint8 buildingType, uint256 x, uint256 y, uint256 fundingRequired) returns (uint256)',
    'function vote(uint256 proposalId, bool support, uint256 amount)',
    'function executeProposal(uint256 proposalId)',
    'function proposals(uint256 proposalId) view returns (uint256 id, address proposer, string title, string description, uint8 buildingType, uint256 x, uint256 y, uint256 fundingRequired, uint256 votesFor, uint256 votesAgainst, uint256 startTime, uint256 endTime, bool executed, bool passed)',
    'function proposalCount() view returns (uint256)',
    'function getProposalVotes(uint256 proposalId) view returns (uint256 votesFor, uint256 votesAgainst)',
    'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
    'function depositToTreasury() payable',
    'function treasury() view returns (uint256 balance, uint256 totalDeposits, uint256 totalWithdrawals)',
    'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 fundingRequired)',
    'event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 amount)',
    'event ProposalExecuted(uint256 indexed proposalId, bool passed)',
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
    'event Staked(address indexed user, uint256 amount)',
    'event Unstaked(address indexed user, uint256 amount)',
    'event RewardsClaimed(address indexed user, uint256 amount)',
    'event BuildingRewardsClaimed(uint256 indexed tokenId, address indexed owner, uint256 amount)',
  ],
} as const;

