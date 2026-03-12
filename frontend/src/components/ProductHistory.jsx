import React, { useState } from 'react';

const ProductHistory = ({ contract }) => {
    const [productId, setProductId] = useState('');
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!contract) return;
        setLoading(true);
        setProductData(null);
        try {
            const data = await contract.getProduct(productId);
            // data is a Result object: [name, description, currentOwner, history]
            const formattedData = {
                name: data[0],
                description: data[1],
                currentOwner: data[2],
                history: data[3]
            };
            setProductData(formattedData);
        } catch (error) {
            console.error(error);
            alert('Error fetching product: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="product-history">
            <h2>Product History</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Product ID:</label>
                    <input
                        type="number"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {productData && (
                <div className="product-details" style={{ marginTop: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ marginTop: 0 }}>📦 {productData.name}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{productData.description}</p>
                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', display: 'inline-block' }}>
                            <small style={{ color: 'var(--primary-color)' }}>Current Owner</small>
                            <div style={{ fontFamily: 'monospace' }}>{productData.currentOwner}</div>
                        </div>
                    </div>

                    <h3>Ownership History</h3>
                    <div className="timeline">
                        {productData.history.map((owner, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>{index === 0 ? '✨ Minted' : '🔄 Transferred'}</h4>
                                    <p style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{owner}</p>
                                    <small style={{ opacity: 0.6 }}>event #{index + 1}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductHistory;
