import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CreateProduct from './components/CreateProduct';
import TransferProduct from './components/TransferProduct';
import ProductHistory from './components/ProductHistory';
import SupplyChainABI from './abi/SupplyChain.json';
import './App.css';

// You would typically replace this with the deployed contract address
// For now, we'll leave it as a placeholder or empty string to be filled by user
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    // Optional: Auto-connect logic or verify network
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());

        // If we have a contract address, instantiate the contract
        if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
          const supplyChainContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            SupplyChainABI.abi,
            signer
          );
          setContract(supplyChainContract);
        } else {
          // For demo purposes if no address is set, we can't interact
          console.warn("Contract address not set in App.jsx");
        }

      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("Please install Metamask!");
    }
  };

  // Helper to handle manual address input for testing
  const [manualAddress, setManualAddress] = useState('');
  const setContractAddress = async () => {
    if (window.ethereum && manualAddress) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const supplyChainContract = new ethers.Contract(
        manualAddress,
        SupplyChainABI.abi,
        signer
      );
      setContract(supplyChainContract);
      alert("Contract connected!");
    }
  }

  return (
    <div className="App">
      <div className="glass-panel" style={{ minHeight: '85vh', padding: '0' }}>
        <header className="app-header">
          <h1>📦 Supply Chain</h1>
          {!account ? (
            <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
          ) : (
            <div className="wallet-info">
              <span className="status-dot"></span>
              <p>{account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          )}
        </header>

        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {account && !contract && (
            <div className="setup-contract">
              <h2>🔗 Connect to Contract</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Enter the deployed contract address to start interacting.
              </p>
              <label>Contract Address</label>
              <input
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder="0x..."
              />
              <button onClick={setContractAddress}>Connect</button>
            </div>
          )}

          {contract && (
            <main>
              <nav className="tabs">
                <button
                  onClick={() => setActiveTab('create')}
                  className={activeTab === 'create' ? 'active' : ''}
                >
                  Create Product
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={activeTab === 'transfer' ? 'active' : ''}
                >
                  Transfer Product
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={activeTab === 'history' ? 'active' : ''}
                >
                  Product History
                </button>
              </nav>

              <div className="content glass-panel" style={{ border: 'none', background: 'rgba(255,255,255,0.03)' }}>
                {activeTab === 'create' && <CreateProduct contract={contract} />}
                {activeTab === 'transfer' && <TransferProduct contract={contract} />}
                {activeTab === 'history' && <ProductHistory contract={contract} />}
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
