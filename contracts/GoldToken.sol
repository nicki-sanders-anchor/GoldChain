// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoldToken is ERC20, Ownable {
    
    mapping(address => bool) public whitelistedAddresses; // KYC/AML whitelist
    
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);
    event TokenMinted(address indexed to, uint256 amount);
    event TokenBurned(address indexed from, uint256 amount);

    // Constructor: Pass name, symbol, and initial owner to the parent constructors
    constructor(address initialOwner) 
        ERC20("Gold Token", "GLD") 
        Ownable(initialOwner) 
    {}

    // Bank mints tokens when new gold is deposited by clients
    function mint(address to, uint256 amount) external onlyOwner {
        require(whitelistedAddresses[to], "Recipient is not whitelisted");
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }

    // Bank burns tokens when clients redeem physical gold
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokenBurned(from, amount);
    }
}
