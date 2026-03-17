import React, { useState } from 'react';

const IconPlus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CreateProduct = ({ contract, showToast }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [origin, setOrigin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return;
        setLoading(true);
        try {
            const tx = await contract.createProduct(name, description, origin);
            await tx.wait();
            showToast('Product created successfully!', 'success');
            setName('');
            setDescription('');
            setOrigin('');
        } catch (error) {
            console.error(error);
            showToast('Error creating product: ' + error.message, 'error');
        }
        setLoading(false);
    };

    return (
        <div className="create-product fade-in-up">
            <div className="create-asset-header">
                <div className="icon-plus-wrapper">
                    <IconPlus />
                </div>
                <h2 className="pro-title">Create New Asset</h2>
                <p className="pro-subtitle">Mint a unique digital twin to the blockchain for permanent tracing.</p>
            </div>
            <form onSubmit={handleSubmit} className="form-pro">
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Origin:</label>
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g., Paris, France"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
