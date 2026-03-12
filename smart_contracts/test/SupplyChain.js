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
        await supplyChain.createProduct("Laptop", "High-end laptop");
        const product = await supplyChain.products(1);
        expect(product.name).to.equal("Laptop");
        expect(product.description).to.equal("High-end laptop");
        expect(product.currentOwner).to.equal(owner.address);
    });

    it("Should transfer ownership", async function () {
        await supplyChain.createProduct("Phone", "Smart phone");
        await supplyChain.transferProduct(1, addr1.address);
        const product = await supplyChain.products(1);
        expect(product.currentOwner).to.equal(addr1.address);
    });

    it("Should fail if non-owner tries to transfer", async function () {
        await supplyChain.createProduct("Tablet", "Nice tablet");
        await expect(
            supplyChain.connect(addr1).transferProduct(1, addr2.address)
        ).to.be.revertedWith("Only owner can transfer");
    });

    it("Should track history", async function () {
        await supplyChain.createProduct("Watch", "Cool watch");
        await supplyChain.transferProduct(1, addr1.address);
        await supplyChain.connect(addr1).transferProduct(1, addr2.address);

        const data = await supplyChain.getProduct(1);
        const history = data[3];
        expect(history.length).to.equal(3);
        expect(history[0]).to.equal(owner.address);
        expect(history[1]).to.equal(addr1.address);
        expect(history[2]).to.equal(addr2.address);
    });
});
