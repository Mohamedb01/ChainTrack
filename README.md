# ChainTrack - Blockchain Supply Chain Project

ChainTrack is a blockchain-based supply chain tracking system designed to ensure transparency, fight counterfeiting, and build consumer trust through an immutable ledger. 

This repository contains both the Smart Contracts (Solidity/Hardhat) and the Frontend Application (React/Vite) necessary to run the project.

## 🚀 Features

*   **Product Creation:** Add new products to the blockchain with a unique manufacturer.
*   **Product Transfer:** Securely transfer ownership of products along the supply chain.
*   **Public Tracking:** View the immutable history of a product's transfers.

## 🛠️ Technology Stack

*   **Smart Contracts:** Solidity, Hardhat, Ethers.js
*   **Frontend:** React, Vite, TailwindCSS (for styling)

## 📦 Project Structure

```
├── frontend/             # React/Vite Frontend Application
├── smart_contracts/      # Hardhat project with Solidity contracts
├── IOB.pdf               # Project Documentation
├── Report.odt            # Project Report Source
└── Report.pdf            # Project Report
```

## ⚙️ Running Locally

Follow these steps to run the application on your local machine.

### 1. Start the Local Blockchain Node
Open a terminal, navigate to the `smart_contracts` directory, and start a local Hardhat node:
```bash
cd smart_contracts
npm install
npx hardhat node
```
This will start a local Ethereum network using Hardhat with several test accounts. Keep this terminal open.

### 2. Deploy Smart Contracts
Open a *new* terminal, navigate to the `smart_contracts` directory, and deploy the `SupplyChain` contract to your local network:
```bash
cd smart_contracts
npx hardhat run scripts/deploy.js --network localhost
```
*Note the deployed contract address. You may need to update it in the frontend if needed in `frontend/src/abi/SupplyChain.json` or related files.*

### 3. Start the Frontend Application
Open a *third* terminal, navigate to the `frontend` directory, install dependencies, and run the development server:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173/` in your browser to interact with the ChainTrack application.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
MIT License
