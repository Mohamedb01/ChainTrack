import React, { useState } from 'react';

const IconPackage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconHistory = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const SkeletonCard = () => (
    <div className="glass-panel shimmer" style={{ height: '200px', marginBottom: '1.5rem', borderRadius: '24px' }}></div>
);

const TrackProduct = ({ contract, account, showToast }) => {
    const [productId, setProductId] = useState('');
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Owner Action States
    const [updateDetails, setUpdateDetails] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [transferDetails, setTransferDetails] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProduct = async (idToFetch) => {
        if (!contract) return;
        setLoading(true);
        try {
            const data = await contract.getProduct(idToFetch);
            const historyData = await contract.getProductHistory(idToFetch);
            
            setProductData({
                id: data[0].toString(),
                name: data[1],
                description: data[2],
                origin: data[3],
                currentOwner: data[4],
                isActive: data[5],
                history: historyData
            });
        } catch (error) {
            console.error(error);
            if (showToast) showToast('Error fetching product: ' + error.message, 'error');
            setProductData(null);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchProduct(productId);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const tx = await contract.updateProduct(productData.id, updateDetails);
            await tx.wait();
            showToast('Status updated successfully!', 'success');
            setUpdateDetails('');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            showToast('Error updating status: ' + error.message, 'error');
        }
        setActionLoading(false);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const tx = await contract.transferProduct(productData.id, transferAddress, transferDetails);
            await tx.wait();
            showToast('Ownership transferred successfully!', 'success');
            setTransferAddress('');
            setTransferDetails('');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            showToast('Error transferring ownership: ' + error.message, 'error');
        }
        setActionLoading(false);
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Are you sure you want to permanently archive this product?')) return;
        setActionLoading(true);
        try {
            const tx = await contract.deactivateProduct(productData.id);
            await tx.wait();
            showToast('Product archived successfully!', 'success');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            showToast('Error archiving product: ' + error.message, 'error');
        }
        setActionLoading(false);
    };

    const isOwner = account && productData && account.toLowerCase() === productData.currentOwner.toLowerCase();

    return (
        <div className="track-product" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Provenance Explorer</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Verify the immutable journey of physical assets on-chain.</p>
            </div>
            
            <form onSubmit={handleSearch} className="search-form-pro">
                <input
                    type="number"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter Product ID to track..."
                    required
                />
                <button type="submit" disabled={loading} className="btn-primary search-btn-pro">
                   <IconSearch /> {loading ? 'Scanning...' : 'Track'}
                </button>
            </form>

            {loading && (
                <div className="skeleton-container">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            )}

            {productData && (
                <div className="product-details fade-in-up">
                    <div className="glass-panel info-card">
                        <div className="status-badge-container">
                            {productData.isActive ? (
                                <span className="status-badge active">AUTHENTIC</span>
                            ) : (
                                <span className="status-badge archived">ARCHIVED</span>
                            )}
                        </div>
                        <h3 className="product-title">
                            <IconPackage /> {productData.name} <span className="product-id-tag">#{productData.id}</span>
                        </h3>
                        <p className="product-desc">{productData.description}</p>
                        
                        <div className="meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">Origin</span>
                                <span className="meta-value">{productData.origin}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Current Custodian</span>
                                <span className="meta-value address">{productData.currentOwner}</span>
                                {isOwner && <span className="you-pill">YOU</span>}
                            </div>
                        </div>
                    </div>

                    {/* Owner Action Panel */}
                    {isOwner && productData.isActive && (
                        <div className="glass-panel owner-controls">
                            <div className="owner-controls-header">
                                <h3>👑 Owner Controls</h3>
                                <p>You hold the private keys for this asset. You can append logs or transfer ownership.</p>
                            </div>
                            
                            <div className="owner-action-grid">
                                {/* Update Status Form */}
                                <div>
                                    <h4 className="meta-label" style={{ marginBottom: '1.25rem', display: 'block' }}>📍 Append Status</h4>
                                    <form onSubmit={handleUpdate} className="form-pro">
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                value={updateDetails}
                                                onChange={(e) => setUpdateDetails(e.target.value)}
                                                placeholder="e.g., Arrived at Checkpoint Bravo"
                                                required
                                            />
                                        </div>
                                        <button type="submit" disabled={actionLoading} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
                                            {actionLoading ? 'Updating...' : 'Log Event'}
                                        </button>
                                    </form>
                                </div>

                                {/* Transfer Ownership Form */}
                                <div>
                                    <h4 className="meta-label" style={{ marginBottom: '1.25rem', display: 'block' }}>🔄 Transfer Asset</h4>
                                    <form onSubmit={handleTransfer} className="form-pro">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <input
                                                type="text"
                                                value={transferAddress}
                                                onChange={(e) => setTransferAddress(e.target.value)}
                                                placeholder="Recipient Address (0x...)"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={transferDetails}
                                                onChange={(e) => setTransferDetails(e.target.value)}
                                                placeholder="Transfer Details/Invoice Ref"
                                                required
                                            />
                                        </div>
                                        <button type="submit" disabled={actionLoading} className="btn-success">
                                            {actionLoading ? 'Transferring...' : 'Transfer to New Owner'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="owner-action-footer">
                                <button type="button" onClick={handleDeactivate} disabled={actionLoading} className="btn-danger">
                                    🗄️ Decommission / Archive Product
                                </button>
                                <p>Permanent action. Disables further updates or transfers.</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Read-only notification if not owner or not active */}
                    {!(isOwner && productData.isActive) && (
                        <div style={{ marginBottom: '3rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            {!productData.isActive ? "This asset has been permanently archived." : "Guest View: Connect owner wallet to update status or transfer."}
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="blockchain-journey">
                        <h3 className="journey-header">
                            <IconHistory /> Blockchain Provenance
                        </h3>
                        <div className="timeline-pro">
                            {productData.history.map((event, index) => {
                                const date = new Date(Number(event.timestamp) * 1000).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                });
                                let colorClass = 'event-primary';
                                if (event.action === 'Created') colorClass = 'event-success';
                                if (event.action === 'Transferred') colorClass = 'event-transfer';
                                if (event.action === 'Updated') colorClass = 'event-warning';
                                if (event.action === 'Deactivated') colorClass = 'event-danger';

                                return (
                                    <div key={index} className={`timeline-card ${colorClass}`}>
                                        <div className="card-header">
                                            <span className="action-tag">{event.action.toUpperCase()}</span>
                                            <span className="timestamp">{date}</span>
                                        </div>
                                        <p className="details">{event.details}</p>
                                        <div className="actor-badge">
                                            <span className="actor-label">Verified Actor:</span>
                                            <span className="actor-address">{event.actor.slice(0, 12)}...{event.actor.slice(-8)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackProduct;
