// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BuildingNFT
 * @dev NFT representing buildings in MetaCity
 */
contract BuildingNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    enum BuildingType { Residential, Commercial, Industrial, Park, SolarFarm, Hospital, School, RecyclingCenter }
    
    struct Building {
        BuildingType buildingType;
        uint256 level;
        uint256 sustainabilityScore;
        uint256 economicValue;
        uint256 createdAt;
        address builder;
        uint256 x;
        uint256 y;
    }
    
    mapping(uint256 => Building) public buildings;
    mapping(address => bool) public authorizedMinters;
    
    event BuildingMinted(
        uint256 indexed tokenId,
        address indexed owner,
        BuildingType buildingType,
        uint256 x,
        uint256 y
    );
    event BuildingUpgraded(uint256 indexed tokenId, uint256 newLevel);
    
    constructor() ERC721("MetaCity Building", "MCBUILDING") Ownable(msg.sender) {}
    
    modifier onlyAuthorized() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
    }
    
    function mintBuilding(
        address to,
        BuildingType buildingType,
        uint256 x,
        uint256 y,
        string memory uri
    ) external onlyAuthorized returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        uint256 sustainabilityScore = calculateInitialSustainability(buildingType);
        uint256 economicValue = calculateInitialEconomicValue(buildingType);
        
        buildings[tokenId] = Building({
            buildingType: buildingType,
            level: 1,
            sustainabilityScore: sustainabilityScore,
            economicValue: economicValue,
            createdAt: block.timestamp,
            builder: to,
            x: x,
            y: y
        });
        
        emit BuildingMinted(tokenId, to, buildingType, x, y);
        return tokenId;
    }
    
    function upgradeBuilding(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not building owner");
        
        Building storage building = buildings[tokenId];
        building.level += 1;
        building.sustainabilityScore += 10;
        building.economicValue += 100;
        
        emit BuildingUpgraded(tokenId, building.level);
    }
    
    function calculateInitialSustainability(BuildingType buildingType) internal pure returns (uint256) {
        if (buildingType == BuildingType.Park) return 100;
        if (buildingType == BuildingType.SolarFarm) return 95;
        if (buildingType == BuildingType.RecyclingCenter) return 90;
        if (buildingType == BuildingType.Residential) return 50;
        if (buildingType == BuildingType.Hospital) return 60;
        if (buildingType == BuildingType.School) return 65;
        if (buildingType == BuildingType.Commercial) return 40;
        return 30; // Industrial
    }
    
    function calculateInitialEconomicValue(BuildingType buildingType) internal pure returns (uint256) {
        if (buildingType == BuildingType.Commercial) return 1000;
        if (buildingType == BuildingType.Industrial) return 900;
        if (buildingType == BuildingType.Residential) return 500;
        if (buildingType == BuildingType.Hospital) return 800;
        if (buildingType == BuildingType.School) return 600;
        if (buildingType == BuildingType.SolarFarm) return 700;
        if (buildingType == BuildingType.RecyclingCenter) return 550;
        return 400; // Park
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
