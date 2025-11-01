// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MetaCityToken.sol";
import "./BuildingNFT.sol";

/**
 * @title CityDAO
 * @dev Main DAO contract for MetaCity governance and treasury
 */
contract CityDAO is Ownable, ReentrancyGuard {
    MetaCityToken public token;
    BuildingNFT public buildingNFT;

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        BuildingNFT.BuildingType buildingType;
        uint256 x;
        uint256 y;
        uint256 fundingRequired;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool passed;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voteAmount;
    }

    struct Treasury {
        uint256 balance;
        uint256 totalDeposits;
        uint256 totalWithdrawals;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod = 3 days;
    uint256 public proposalThreshold = 100 * 10 ** 18; // 100 tokens to propose
    uint256 public quorumPercentage = 10; // 10% of total supply

    Treasury public treasury;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 fundingRequired
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 amount
    );
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event TreasuryDeposit(address indexed from, uint256 amount);
    event TreasuryWithdrawal(address indexed to, uint256 amount);

    constructor(address _token, address _buildingNFT) Ownable(msg.sender) {
        token = MetaCityToken(_token);
        buildingNFT = BuildingNFT(_buildingNFT);
    }

    function createProposal(
        string memory title,
        string memory description,
        BuildingNFT.BuildingType buildingType,
        uint256 x,
        uint256 y,
        uint256 fundingRequired
    ) external returns (uint256) {
        require(
            token.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );
        require(
            fundingRequired <= treasury.balance,
            "Insufficient treasury funds"
        );

        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];

        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.buildingType = buildingType;
        proposal.x = x;
        proposal.y = y;
        proposal.fundingRequired = fundingRequired;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;

        emit ProposalCreated(proposalId, msg.sender, title, fundingRequired);
        return proposalId;
    }

    function vote(
        uint256 proposalId,
        bool support,
        uint256 amount
    ) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(
            token.balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );

        proposal.hasVoted[msg.sender] = true;
        proposal.voteAmount[msg.sender] = amount;

        if (support) {
            proposal.votesFor += amount;
        } else {
            proposal.votesAgainst += amount;
        }

        emit VoteCast(proposalId, msg.sender, support, amount);
    }

    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");

        uint256 quorum = (token.totalSupply() * quorumPercentage) / 100;
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;

        proposal.executed = true;

        if (totalVotes >= quorum && proposal.votesFor > proposal.votesAgainst) {
            proposal.passed = true;

            // Mint building NFT
            buildingNFT.mintBuilding(
                proposal.proposer,
                proposal.buildingType,
                proposal.x,
                proposal.y,
                ""
            );

            // Deduct from treasury
            treasury.balance -= proposal.fundingRequired;
            treasury.totalWithdrawals += proposal.fundingRequired;
        }

        emit ProposalExecuted(proposalId, proposal.passed);
    }

    function depositToTreasury() external payable {
        treasury.balance += msg.value;
        treasury.totalDeposits += msg.value;
        emit TreasuryDeposit(msg.sender, msg.value);
    }

    function setVotingPeriod(uint256 _votingPeriod) external onlyOwner {
        votingPeriod = _votingPeriod;
    }

    function setProposalThreshold(uint256 _threshold) external onlyOwner {
        proposalThreshold = _threshold;
    }

    function setQuorumPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 100, "Invalid percentage");
        quorumPercentage = _percentage;
    }

    function getProposalVotes(
        uint256 proposalId
    ) external view returns (uint256 votesFor, uint256 votesAgainst) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.votesFor, proposal.votesAgainst);
    }

    function hasVoted(
        uint256 proposalId,
        address voter
    ) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
}
