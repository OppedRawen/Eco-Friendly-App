// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoBadgeNFT is ERC721, Ownable {
    uint public badgeCounter;

    struct BadgeTraits {
        string activityType;
        uint points;
    }

    mapping(uint => BadgeTraits) public badgeTraits;

    constructor(address initialOwner) ERC721("EcoBadge", "ECO") Ownable(initialOwner) {
        transferOwnership(initialOwner); // Optional, only if needed for Ownable functionality
    }

    function mintBadge(address recipient, string memory activityType, uint points) public onlyOwner {
        uint badgeId = badgeCounter++;
        _safeMint(recipient, badgeId);
        badgeTraits[badgeId] = BadgeTraits(activityType, points);
    }
}
