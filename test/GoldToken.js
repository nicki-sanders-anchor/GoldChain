const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers; // ✅ Extract ethers.utils from ethers

describe("GoldToken", function () {
    let GoldToken, goldToken;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        GoldToken = await ethers.getContractFactory("GoldToken");
        goldToken = await GoldToken.deploy(owner.address); // No need for .deployed()
    });

    describe("Deployment", function () {
        it("should deploy the contract and set the correct owner", async function () {
            expect(await goldToken.owner()).to.equal(owner.address);
        });

        it("should set the correct name and symbol for the token", async function () {
            expect(await goldToken.name()).to.equal("Gold Token");
            expect(await goldToken.symbol()).to.equal("GLD");
        });
    });

    describe("Minting", function () {
        it("should allow the owner to mint tokens to a specified address", async function () {
            await goldToken.mint(addr1.address, utils.parseUnits('100', 18)); // ✅ Use utils.parseUnits
            const balance = await goldToken.balanceOf(addr1.address);
            expect(balance).to.equal(utils.parseUnits('100', 18)); // ✅ Use utils.parseUnits
        });

        it("should emit a TokenMinted event when tokens are minted", async function () {
            await expect(goldToken.mint(addr1.address, parseUnits('100', 18))) // ✅ Corrected here
                .to.emit(goldToken, "TokenMinted")
                .withArgs(addr1.address, parseUnits('100', 18)); // ✅ Corrected here
        });

        it("should revert if a non-owner tries to mint tokens", async function () {
            await expect(
                goldToken.connect(addr1).mint(addr2.address, parseUnits('100', 18)) // ✅ Corrected here
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Burning", function () {
        it("should allow the owner to burn tokens from a specified address", async function () {
            await goldToken.mint(addr1.address, parseUnits('100', 18)); // ✅ Corrected here
            await goldToken.burn(addr1.address, parseUnits('50', 18)); // ✅ Corrected here

            const balance = await goldToken.balanceOf(addr1.address);
            expect(balance).to.equal(parseUnits('50', 18)); // ✅ Corrected here
        });

        it("should emit a TokenBurned event when tokens are burned", async function () {
            await goldToken.mint(addr1.address, parseUnits('100', 18)); // ✅ Corrected here
            await expect(goldToken.burn(addr1.address, parseUnits('50', 18))) // ✅ Corrected here
                .to.emit(goldToken, "TokenBurned")
                .withArgs(addr1.address, parseUnits('50', 18)); // ✅ Corrected here
        });
    });

    describe("Whitelisting", function () {
        it("should allow the owner to whitelist an address", async function () {
            await goldToken.whitelistAddress(addr1.address);
            expect(await goldToken.whitelistedAddresses(addr1.address)).to.be.true;
        });

        it("should allow the owner to remove a whitelisted address", async function () {
            await goldToken.whitelistAddress(addr1.address);
            await goldToken.removeWhitelistedAddress(addr1.address);
            expect(await goldToken.whitelistedAddresses(addr1.address)).to.be.false;
        });

        it("should emit an AddressWhitelisted event", async function () {
            await expect(goldToken.whitelistAddress(addr1.address))
                .to.emit(goldToken, "AddressWhitelisted")
                .withArgs(addr1.address);
        });
    });

    describe("Access Control", function () {
        it("should allow the owner to transfer ownership to a new address", async function () {
            await goldToken.transferOwnership(addr1.address);
            expect(await goldToken.owner()).to.equal(addr1.address);
        });

        it("should revert if a non-owner tries to transfer ownership", async function () {
            await expect(
                goldToken.connect(addr1).transferOwnership(addr2.address)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
