import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateProduct = ({ contract }) => {
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
            alert('Product created successfully!');
            setName('');
            setDescription('');
            setOrigin('');
        } catch (error) {
            console.error(error);
            alert('Error creating product: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="create-product" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨ Create New Product</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Mint a new item to the supply chain blockchain.</p>
            </div>
            <form onSubmit={handleSubmit}>
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
