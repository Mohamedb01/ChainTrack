// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChain {
    struct History {
        string action; // "Created", "Transferred", "Updated", "Deactivated"
        string details; // Location or handling info
        address actor;
        uint256 timestamp;
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        string origin;
        address currentOwner;
        bool isActive;
        History[] history;
    }

    uint256 private _productIds;
    mapping(uint256 => Product) public products;

    event ProductCreated(uint256 indexed id, string name, address indexed owner);
    event ProductTransferred(uint256 indexed id, address indexed from, address indexed to, string details);
    event ProductUpdated(uint256 indexed id, string details, address indexed actor);
    event ProductDeactivated(uint256 indexed id, address indexed actor);

    function createProduct(string memory _name, string memory _description, string memory _origin) public returns (uint256) {
        _productIds++;
        uint256 newId = _productIds;
        Product storage newProduct = products[newId];
        newProduct.id = newId;
        newProduct.name = _name;
        newProduct.description = _description;
        newProduct.origin = _origin;
        newProduct.currentOwner = msg.sender;
        newProduct.isActive = true;
        
        newProduct.history.push(History({
            action: "Created",
            details: string(abi.encodePacked("Origin: ", _origin)),
            actor: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ProductCreated(newId, _name, msg.sender);
        return newId;
    }

    function transferProduct(uint256 _productId, address _newOwner, string memory _details) public {
        Product storage product = products[_productId];
        require(product.isActive, "Product is not active");
        require(msg.sender == product.currentOwner, "Only owner can transfer");
        require(_newOwner != address(0), "Invalid new owner");
        
        address previousOwner = product.currentOwner;
        product.currentOwner = _newOwner;
        
        product.history.push(History({
            action: "Transferred",
            details: _details,
            actor: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ProductTransferred(_productId, previousOwner, _newOwner, _details);
    }

    function updateProduct(uint256 _productId, string memory _details) public {
        Product storage product = products[_productId];
        require(product.isActive, "Product is not active");
        require(msg.sender == product.currentOwner, "Only owner can update");
        
        product.history.push(History({
            action: "Updated",
            details: _details,
            actor: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ProductUpdated(_productId, _details, msg.sender);
    }

    function deactivateProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        require(product.isActive, "Product is already inactive");
        require(msg.sender == product.currentOwner, "Only owner can deactivate");
        
        product.isActive = false;
        
        product.history.push(History({
            action: "Deactivated",
            details: "Product marked as inactive/archived",
            actor: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit ProductDeactivated(_productId, msg.sender);
    }

    function getProduct(uint256 _productId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        string memory origin,
        address currentOwner,
        bool isActive
    ) {
        require(_productId > 0 && _productId <= _productIds, "Product does not exist");
        Product storage product = products[_productId];
        return (
            product.id,
            product.name,
            product.description,
            product.origin,
            product.currentOwner,
            product.isActive
        );
    }

    function getProductHistory(uint256 _productId) public view returns (History[] memory) {
        require(_productId > 0 && _productId <= _productIds, "Product does not exist");
        return products[_productId].history;
    }
}
