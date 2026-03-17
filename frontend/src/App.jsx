import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreateProduct from './components/CreateProduct';
import TrackProduct from './components/TrackProduct';
import SupplyChainABI from './abi/SupplyChain.json';
import "./App.css";

// --- Professional Icons (SVG) ---
const IconLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconBox = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CONTRACT_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState("track");
  const [manualAddress, setManualAddress] = useState("");
  const [showPublicTrack, setShowPublicTrack] = useState(false);
  const [guestSearchId, setGuestSearchId] = useState("");
  const [toasts, setToasts] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(0);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // Initialize read-only contract for guests
    const initReadOnly = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const block = await provider.getBlockNumber();
        setCurrentBlock(block);
        const supplyChainContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SupplyChainABI.abi,
          provider
        );
        setContract(supplyChainContract);
      } catch (err) {
        console.error("Error initializing read-only contract:", err);
      }
    };
    initReadOnly();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        connectWallet();
      } else {
        setAccount("");
        setContract(null);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast("Please install MetaMask!", "error");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      if (CONTRACT_ADDRESS) {
        const supplyChainContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SupplyChainABI.abi,
          signer
        );
        setContract(supplyChainContract);
        showToast("Wallet connected successfully", "success");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      showToast("Failed to connect wallet", "error");
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
        showToast("Contract connected!", "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to connect to contract address.", "error");
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
        <header className="app-header">
          <div className="logo-container" onClick={() => setShowPublicTrack(false)}>
            <div className="logo-icon-wrapper">
              <IconLogo />
            </div>
            <span className="logo-text">ChainTrack</span>
          </div>

          <nav className="nav-links">
            <a href="#" className={!showPublicTrack ? "active" : ""} onClick={(e) => { e.preventDefault(); setShowPublicTrack(false); }}>Home</a>
            <a href="#" className={showPublicTrack && activeTab === 'create' ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveTab('create'); setShowPublicTrack(true); }}>Create</a>
            <a href="#" className={showPublicTrack && activeTab === 'track' ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveTab('track'); setShowPublicTrack(true); }}>Track</a>
          </nav>

          <div className="header-actions">
            <div className="system-status-chip">
              <span className="pulse-dot"></span>
              Local Node: #{currentBlock}
            </div>
            {!account && showPublicTrack && (
              <button className="btn-outline back-home-btn" onClick={() => setShowPublicTrack(false)}>
                Back to Home
              </button>
            )}
            {account ? (
              <div className="wallet-badge">
                <div className="wallet-dot"></div>
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            ) : (
              <button className="btn-primary connect-wallet-btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {(!account && !showPublicTrack) ? (
          <div className="landing-page fade-in-up">
            <section className="hero-section">
              <h2>Transparent Supply Chain</h2>
              <div className="subtitle-gradient">Powered by Blockchain</div>
              <p className="hero-description">Track products from origin to consumer with immutable history and complete transparency.</p>


              <div className="hero-actions">
                <button className="btn-primary" onClick={() => {
                  setActiveTab('track');
                  setShowPublicTrack(true);
                }}>Start Tracking</button>
                <button className="btn-outline" onClick={() => {
                  setActiveTab('create');
                  setShowPublicTrack(true);
                }}>Tokenize Product</button>
              </div>
            </section>

            <section className="features-grid">
              <div className="feature-card glass-panel highlight-success">
                <div className="feature-icon"><IconBox /></div>
                <h3>Immutable Ledger</h3>
                <p>Every transfer and status update is permanently recorded on the blockchain, creating an unalterable history.</p>
              </div>
              <div className="feature-card glass-panel highlight-primary">
                <div className="feature-icon"><IconSearch /></div>
                <h3>Transparent Tracking</h3>
                <p>Instantly verify the origin and journey of any product with a simple ID search or QR scan.</p>
              </div>
              <div className="feature-card glass-panel highlight-accent">
                <div className="feature-icon"><IconShield /></div>
                <h3>Cryptographic Security</h3>
                <p>Ownership is secured by advanced cryptography, preventing counterfeiting and unauthorized modifications.</p>
              </div>
            </section>
          </div>
        ) : (
          <>
            {!contract && (
              <div className="setup-overlay">
                <div className="setup-contract glass-panel">
                  <div className="setup-icon-wrapper">
                    <IconLogo />
                  </div>
                  <h2>Connect to Contract</h2>
                  <p>Enter the deployed contract address to interact with the supply chain.</p>

                  <div className="form-pro">
                    <div className="input-field">
                      <input
                        value={manualAddress}
                        onChange={e => setManualAddress(e.target.value)}
                        placeholder="0x..."
                        required
                      />
                    </div>
                    <button className="btn-primary" onClick={setContractAddress}>
                      Initialize Connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {contract && (
              <div className="dashboard-container">
                <div className="tabs">
                  {account && (
                    <button
                      className={activeTab === 'create' ? 'active' : ''}
                      onClick={() => setActiveTab('create')}
                    >✨ Mint Item</button>
                  )}
                  <button
                    className={activeTab === 'track' ? 'active' : ''}
                    onClick={() => setActiveTab('track')}
                  >🔍 Track & Manage</button>
                </div>

                <main className="content glass-panel" style={{ position: 'relative', zIndex: 10 }}>
                  <div key={activeTab} className="tab-content-active">
                    {activeTab === 'create' && <CreateProduct contract={contract} showToast={showToast} />}
                    {activeTab === 'track' && <TrackProduct contract={contract} account={account} showToast={showToast} />}
                  </div>
                </main>
              </div>
            )}
          </>
        )}

        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && '✅ '}
              {toast.type === 'error' && '❌ '}
              {toast.type === 'info' && 'ℹ️ '}
              {toast.message}
            </div>
          ))}
        </div>

        <footer className="app-footer">
          <p>© 2026 ChainTrack Prototype. Built for transparency.</p>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Security</a>
            <a href="#">Legal</a>
            <a href="#">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
