# ChainTrack ⛓️

ChainTrack is a decentralized, blockchain-based supply chain framework designed to provide immutable, verifiable, and transparent product provenance. Built on Ethereum-compatible smart contracts and a modern React frontend with Ethers.js, it models physical goods as digital twins. This allows manufacturers to tokenize assets, securely transfer ownership using cryptographic proofs, and permanently record every significant lifecycle event, from origin to decommissioning, on a transparent, tamper-resistant ledger, thereby eliminating information asymmetry and combating counterfeiting across global supply networks.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MetaMask](https://metamask.io/) extension

### 1. Setup
```bash
# Install dependencies
cd smart_contracts && npm install
cd ../frontend && npm install
```

### 2. Local Blockchain
```bash
# Terminal 1: Start node
cd smart_contracts
npx hardhat node
```

### 3. Deployment
```bash
# Terminal 2: Deploy contract
cd smart_contracts
npx hardhat run scripts/deploy.js --network localhost
```
*Tip: Confirm the contract address in the output matches `App.jsx`.*

### 4. MetaMask
- **RPC Network**: `http://127.0.0.1:8545` (Chain ID: `31337`)
- **Import Accounts**: Use the private keys from the Hardhat node output.

### 5. Launch
```bash
cd frontend
npm run dev
```

### 6. Test
```bash
cd smart_contracts
npx hardhat test
```

## 🛠️ Tech Stack
- **Smart Contracts**: Solidity, Hardhat, Ethers.js
- **Frontend**: React, Vite, Vanilla CSS
- **Wallet Integration**: MetaMask

## 🛡️ Key Features
- **Minting**: Create unique product records on-chain.
- **Transfer**: Securely transfer ownership between blockchain addresses.
- **Tracking**: View the full provenance and timeline of any product ID.
- **Reactive UI**: Modern, glassmorphic design that updates instantly.
