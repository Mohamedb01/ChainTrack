import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SupplyChainABI from "./abi/SupplyChain.json";
import CreateProduct from "./components/CreateProduct";
import TrackProduct from "./components/TrackProduct";
import "./App.css";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState("track");
  const [manualAddress, setManualAddress] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      let signer;
      let address;

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        address = await signer.getAddress();
      } else {
        console.warn("No ethereum provider found. Falling back to local Hardhat node.");
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = await provider.getSigner(); 
        address = await signer.getAddress();
      }
      
      setAccount(address);

      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
        const supplyChainContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SupplyChainABI.abi,
          signer
        );
        setContract(supplyChainContract);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Error connecting wallet. Ensure Hardhat node is running.");
    }
  };

  const setContractAddress = async () => {
    if (manualAddress) {
      try {
        let signer;
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
        } else {
          const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
          signer = await provider.getSigner(); 
        }
        const supplyChainContract = new ethers.Contract(
          manualAddress,
          SupplyChainABI.abi,
          signer
        );
        setContract(supplyChainContract);
        alert("Contract connected!");
      } catch (err) {
        console.error(err);
        alert("Failed to connect to contract address.");
      }
    }
  };

  return (
    <>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <div className="App">
        <header className="app-header glass-panel">
          <h1>⛓️ ChainTrack</h1>
          {account ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10b981', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px', 
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            </div>
          ) : (
            <button className="action-btn" onClick={connectWallet} style={{ width: 'auto', margin: 0, padding: '0.75rem 1.5rem' }}>
              Connect Wallet
            </button>
          )}
        </header>

        {account && !contract && (
          <div className="setup-contract glass-panel">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 Connect to Contract</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enter the deployed contract address to interact with the supply chain.</p>
            <div style={{display: 'flex', gap: '1rem'}}>
              <input
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder="0x..."
                style={{margin: 0, flex: 1}}
              />
              <button className="action-btn" onClick={setContractAddress} style={{margin: 0, width: 'auto'}}>Connect</button>
            </div>
          </div>
        )}

        {account && contract && (
          <div className="dashboard-container">
            <div className="tabs">
              <button 
                className={activeTab === 'create' ? 'active' : ''} 
                onClick={() => setActiveTab('create')}
              >✨ Mint Item</button>
              <button 
                className={activeTab === 'track' ? 'active' : ''} 
                onClick={() => setActiveTab('track')}
              >🔍 Track & Manage</button>
            </div>

            <main className="content glass-panel" style={{ position: 'relative', zIndex: 10 }}>
              {activeTab === 'create' && <CreateProduct contract={contract} />}
              {activeTab === 'track' && <TrackProduct contract={contract} account={account} />}
            </main>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
