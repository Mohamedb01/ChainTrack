const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
    let SupplyChain, supplyChain, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        SupplyChain = await ethers.getContractFactory("SupplyChain");
        supplyChain = await SupplyChain.deploy();
    });

    it("Should create a new product", async function () {
        await supplyChain.createProduct("Laptop", "High-end laptop", "USA");
        const product = await supplyChain.getProduct(1);
        expect(product.name).to.equal("Laptop");
        expect(product.description).to.equal("High-end laptop");
        expect(product.origin).to.equal("USA");
        expect(product.currentOwner).to.equal(owner.address);
        expect(product.isActive).to.equal(true);

        const history = await supplyChain.getProductHistory(1);
        expect(history.length).to.equal(1);
        expect(history[0].action).to.equal("Created");
        expect(history[0].actor).to.equal(owner.address);
    });

    it("Should transfer ownership", async function () {
        await supplyChain.createProduct("Phone", "Smart phone", "China");
        await supplyChain.transferProduct(1, addr1.address, "Shipped to distributor");
        const product = await supplyChain.getProduct(1);
        expect(product.currentOwner).to.equal(addr1.address);

        const history = await supplyChain.getProductHistory(1);
        expect(history.length).to.equal(2);
        expect(history[1].action).to.equal("Transferred");
        expect(history[1].actor).to.equal(owner.address);
        expect(history[1].details).to.equal("Shipped to distributor");
    });

    it("Should fail if non-owner tries to transfer", async function () {
        await supplyChain.createProduct("Tablet", "Nice tablet", "Taiwan");
        await expect(
            supplyChain.connect(addr1).transferProduct(1, addr2.address, "Sneaky transfer")
        ).to.be.revertedWith("Only owner can transfer");
    });

    it("Should allow owner to update product", async function () {
        await supplyChain.createProduct("Watch", "Cool watch", "Switzerland");
        await supplyChain.updateProduct(1, "Arrived at customs in NY");
        
        const history = await supplyChain.getProductHistory(1);
        expect(history.length).to.equal(2);
        expect(history[1].action).to.equal("Updated");
        expect(history[1].details).to.equal("Arrived at customs in NY");
        expect(history[1].actor).to.equal(owner.address);
    });

    it("Should deactivate a product", async function () {
        await supplyChain.createProduct("Milk", "Fresh milk", "Farm A");
        await supplyChain.deactivateProduct(1);
        
        const product = await supplyChain.getProduct(1);
        expect(product.isActive).to.equal(false);

        const history = await supplyChain.getProductHistory(1);
        expect(history.length).to.equal(2);
        expect(history[1].action).to.equal("Deactivated");

        // Should not allow transfer after deactivation
        await expect(
            supplyChain.transferProduct(1, addr1.address, "Cannot transfer")
        ).to.be.revertedWith("Product is not active");
    });
});
