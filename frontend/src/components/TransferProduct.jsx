import React, { useState } from 'react';

const TransferProduct = ({ contract }) => {
    const [productId, setProductId] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!contract) return;
        setLoading(true);
        try {
            const tx = await contract.transferProduct(productId, newOwner);
            await tx.wait();
            alert('Product transferred successfully!');
            setProductId('');
            setNewOwner('');
        } catch (error) {
            console.error(error);
            alert('Error transferring product: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="transfer-product" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄 Transfer Ownership</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Securely transfer a product to a new owner address.</p>
            </div>
            <form onSubmit={handleTransfer}>
                <div>
                    <label>Product ID:</label>
                    <input
                        type="number"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Owner Address:</label>
                    <input
                        type="text"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Transfer Ownership'}
                </button>
            </form>
        </div>
    );
};

export default TransferProduct;
