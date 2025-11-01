// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MetaCityToken.sol";
import "./BuildingNFT.sol";

/**
 * @title RewardsManager
 * @dev Manages staking, yield farming, and sustainability rewards
 */
contract RewardsManager is Ownable, ReentrancyGuard {
    MetaCityToken public token;
    BuildingNFT public buildingNFT;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 totalRewards;
    }

    struct BuildingRewards {
        uint256 lastClaimTime;
        uint256 totalEarned;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(uint256 => BuildingRewards) public buildingRewards;

    uint256 public constant DAILY_STAKE_RATE = 10; // 10% APY = 0.027% daily
    uint256 public constant SUSTAINABILITY_MULTIPLIER = 2;
    uint256 public constant BASE_BUILDING_REWARD = 10 * 10 ** 18; // 10 tokens per day

    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event BuildingRewardsClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 amount
    );

    constructor(address _token, address _buildingNFT) Ownable(msg.sender) {
        token = MetaCityToken(_token);
        buildingNFT = BuildingNFT(_buildingNFT);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        if (stakes[msg.sender].amount > 0) {
            _claimStakeRewards();
        }

        token.transferFrom(msg.sender, address(this), amount);

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(
            stakes[msg.sender].amount >= amount,
            "Insufficient staked amount"
        );

        _claimStakeRewards();

        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;

        token.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function claimStakeRewards() external nonReentrant {
        _claimStakeRewards();
    }

    function _claimStakeRewards() internal {
        uint256 rewards = calculateStakeRewards(msg.sender);

        if (rewards > 0) {
            stakes[msg.sender].lastClaimTime = block.timestamp;
            stakes[msg.sender].totalRewards += rewards;

            token.mint(msg.sender, rewards);

            emit RewardsClaimed(msg.sender, rewards);
        }
    }

    function calculateStakeRewards(address user) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];

        if (stakeInfo.amount == 0) {
            return 0;
        }

        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 dailyReward = (stakeInfo.amount * DAILY_STAKE_RATE) / 36500; // 10% APY
        uint256 rewards = (dailyReward * timeStaked) / 1 days;

        return rewards;
    }

    function claimBuildingRewards(uint256 tokenId) external nonReentrant {
        require(
            buildingNFT.ownerOf(tokenId) == msg.sender,
            "Not building owner"
        );

        uint256 rewards = calculateBuildingRewards(tokenId);

        if (rewards > 0) {
            buildingRewards[tokenId].lastClaimTime = block.timestamp;
            buildingRewards[tokenId].totalEarned += rewards;

            token.mint(msg.sender, rewards);

            emit BuildingRewardsClaimed(tokenId, msg.sender, rewards);
        }
    }

    function calculateBuildingRewards(
        uint256 tokenId
    ) public view returns (uint256) {
        (
            ,
            uint256 level,
            uint256 sustainabilityScore,
            uint256 economicValue,
            uint256 createdAt,
            ,
            ,

        ) = buildingNFT.buildings(tokenId);

        uint256 lastClaim = buildingRewards[tokenId].lastClaimTime;
        if (lastClaim == 0) {
            lastClaim = createdAt;
        }

        uint256 timeSinceLastClaim = block.timestamp - lastClaim;
        uint256 daysElapsed = timeSinceLastClaim / 1 days;

        if (daysElapsed == 0) {
            return 0;
        }

        uint256 baseReward = BASE_BUILDING_REWARD * daysElapsed;
        uint256 levelBonus = (baseReward * level) / 10;
        uint256 sustainabilityBonus = (baseReward * sustainabilityScore) / 100;
        uint256 economicBonus = (baseReward * economicValue) / 10000;

        return baseReward + levelBonus + sustainabilityBonus + economicBonus;
    }

    function getStakeInfo(
        address user
    )
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            uint256 pendingRewards,
            uint256 totalRewards
        )
    {
        StakeInfo memory stakeInfo = stakes[user];
        uint256 pending = calculateStakeRewards(user);

        return (
            stakeInfo.amount,
            stakeInfo.startTime,
            pending,
            stakeInfo.totalRewards
        );
    }
}
