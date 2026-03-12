// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChain {
    struct Product {
        uint256 id;
        string name;
        string description;
        address currentOwner;
        address[] history;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint256 indexed id, string name, address indexed owner);
    event ProductTransferred(uint256 indexed id, address indexed oldOwner, address indexed newOwner);

    function createProduct(string memory _name, string memory _description) public {
        productCount++;
        // Initialize history with current owner
        address[] memory initialHistory = new address[](1);
        initialHistory[0] = msg.sender;

        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _description,
            currentOwner: msg.sender,
            history: initialHistory
        });
        
        emit ProductCreated(productCount, _name, msg.sender);
    }

    function transferProduct(uint256 _productId, address _newOwner) public {
        Product storage product = products[_productId];
        require(product.id != 0, "Product does not exist");
        require(msg.sender == product.currentOwner, "Only owner can transfer");
        require(_newOwner != address(0), "Invalid new owner");

        address oldOwner = product.currentOwner;
        product.currentOwner = _newOwner;
        product.history.push(_newOwner);

        emit ProductTransferred(_productId, oldOwner, _newOwner);
    }

    function getProduct(uint256 _productId) public view returns (string memory name, string memory description, address currentOwner, address[] memory history) {
        Product storage product = products[_productId];
        return (product.name, product.description, product.currentOwner, product.history);
    }
}
