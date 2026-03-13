import React, { useState } from 'react';

const TrackProduct = ({ contract, account }) => {
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
            alert('Error fetching product: ' + error.message);
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
            alert('Status updated successfully!');
            setUpdateDetails('');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            alert('Error updating status: ' + error.message);
        }
        setActionLoading(false);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const tx = await contract.transferProduct(productData.id, transferAddress, transferDetails);
            await tx.wait();
            alert('Ownership transferred successfully!');
            setTransferAddress('');
            setTransferDetails('');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            alert('Error transferring ownership: ' + error.message);
        }
        setActionLoading(false);
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Are you sure you want to permanently archive this product?')) return;
        setActionLoading(true);
        try {
            const tx = await contract.deactivateProduct(productData.id);
            await tx.wait();
            alert('Product archived successfully!');
            await fetchProduct(productData.id); // Refresh
        } catch (error) {
            console.error(error);
            alert('Error archiving product: ' + error.message);
        }
        setActionLoading(false);
    };

    const isOwner = account && productData && account.toLowerCase() === productData.currentOwner.toLowerCase();

    return (
        <div className="track-product" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍 Track & Manage</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Search the blockchain to view provenance or manage your assets.</p>
            </div>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    type="number"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter Product ID to track..."
                    required
                    style={{ flex: 1, margin: 0 }}
                />
                <button type="submit" disabled={loading} style={{ margin: 0, width: 'auto' }}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {productData && (
                <div className="product-details" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    {/* View Panel */}
                    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                            {productData.isActive ? (
                                <span style={{ background: '#10b981', color: 'black', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>ACTIVE</span>
                            ) : (
                                <span style={{ background: '#ef4444', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}>ARCHIVED</span>
                            )}
                        </div>
                        <h3 style={{ marginTop: 0, fontSize: '1.8rem', marginBottom: '0.5rem' }}>📦 {productData.name} <span style={{ color: 'var(--text-secondary)' }}>#{productData.id}</span></h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{productData.description}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                            <div>
                                <small style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Origin</small>
                                <strong>{productData.origin}</strong>
                            </div>
                            <div>
                                <small style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.2rem' }}>Current Owner</small>
                                <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>{productData.currentOwner}</strong>
                                {isOwner && <span style={{ marginLeft: '0.5rem', background: 'var(--primary-color)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>YOU</span>}
                            </div>
                        </div>
                    </div>

                    {/* Owner Action Panel */}
                    {isOwner && productData.isActive && (
                        <div className="glass-panel owner-controls" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary-color)', background: 'rgba(99, 102, 241, 0.05)' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                👑 Owner Controls
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>You hold the private keys for this asset. You can append logs or transfer ownership.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Update Status Form */}
                                <div>
                                    <h4 style={{ marginBottom: '1rem' }}>📍 Append Status</h4>
                                    <form onSubmit={handleUpdate}>
                                        <input
                                            type="text"
                                            value={updateDetails}
                                            onChange={(e) => setUpdateDetails(e.target.value)}
                                            placeholder="e.g., Arrived at Checkpoint Bravo"
                                            required
                                            style={{ marginBottom: '1rem' }}
                                        />
                                        <button type="submit" disabled={actionLoading} style={{ margin: 0, padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                                            {actionLoading ? 'Updating...' : 'Log Event'}
                                        </button>
                                    </form>
                                </div>

                                {/* Transfer Ownership Form */}
                                <div>
                                    <h4 style={{ marginBottom: '1rem' }}>🔄 Transfer Asset</h4>
                                    <form onSubmit={handleTransfer}>
                                        <input
                                            type="text"
                                            value={transferAddress}
                                            onChange={(e) => setTransferAddress(e.target.value)}
                                            placeholder="Recipient Address (0x...)"
                                            required
                                            style={{ marginBottom: '0.5rem' }}
                                        />
                                        <input
                                            type="text"
                                            value={transferDetails}
                                            onChange={(e) => setTransferDetails(e.target.value)}
                                            placeholder="Transfer Details/Invoice Ref"
                                            required
                                            style={{ marginBottom: '1rem' }}
                                        />
                                        <button type="submit" disabled={actionLoading} style={{ margin: 0, padding: '0.6rem 1rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                            {actionLoading ? 'Transferring...' : 'Transfer to New Owner'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <button type="button" onClick={handleDeactivate} disabled={actionLoading} style={{ background: '#ef4444', color: 'white', padding: '0.6rem 1rem', fontSize: '0.9rem', width: 'auto', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                                    🗄️ Decommission / Archive Product
                                </button>
                                <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Permanent action. Disables further updates or transfers.</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Read-only notification if not owner or not active */}
                    {!(isOwner && productData.isActive) && (
                        <div style={{ marginBottom: '2rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {!productData.isActive ? "This product is archived and cannot be modified." : "You are viewing this product as a guest. Only the current owner can append logs."}
                        </div>
                    )}

                    {/* Timeline */}
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⏱️ Blockchain Timeline</h3>
                    <div className="timeline" style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px' }}>
                        {productData.history.map((event, index) => {
                            const date = new Date(Number(event.timestamp) * 1000).toLocaleString();
                            let icon = '📝';
                            let color = 'var(--text-primary)';
                            
                            if (event.action === 'Created') { icon = '✨'; color = '#10b981'; } /* Green */
                            if (event.action === 'Transferred') { icon = '🔄'; color = '#3b82f6'; } /* Blue */
                            if (event.action === 'Updated') { icon = '📍'; color = '#f59e0b'; } /* Yellow/Orange */
                            if (event.action === 'Deactivated') { icon = '🗄️'; color = '#ef4444'; } /* Red */

                            return (
                                <div key={index} className="timeline-item" style={{ marginBottom: index === productData.history.length - 1 ? 0 : '2rem', borderLeft: `2px solid ${color}`, paddingLeft: '1.5rem', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-1rem', top: '0', background: 'var(--bg-color)', borderRadius: '50%', padding: '0.2rem', fontSize: '1.2rem', border: `1px solid ${color}` }}>{icon}</div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: color, fontSize: '1.1rem' }}>{event.action}</h4>
                                    <p style={{ margin: '0 0 0.5rem 0', fontStyle: 'italic', fontSize: '1.05rem' }}>"{event.details}"</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7, fontSize: '0.85rem' }}>
                                        <span><strong>By:</strong> <span style={{ fontFamily: 'monospace' }}>{event.actor}</span></span>
                                        <span>{date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackProduct;
