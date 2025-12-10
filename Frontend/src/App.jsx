import React, { useState, useEffect, useCallback } from 'react';
import * as api from './api';
import './App.css'; // You'll need to create a simple CSS file

const App = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [newProductData, setNewProductData] = useState({ name: '', sku: '', initialStock: 0 });
  const [stockChange, setStockChange] = useState(1);
  const [message, setMessage] = useState('');
  const [viewHistory, setViewHistory] = useState(false);

  // --- Utility Functions ---

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchProductSummary = useCallback(async (id) => {
    if (!id) return;
    try {
      const response = await api.getProductSummary(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product summary:', error);
      setProduct(null);
      showMessage(`Error fetching product: ${error.response?.data?.message || error.message}`);
    }
  }, []);

  const fetchTransactionHistory = useCallback(async (id) => {
    if (!id) return;
    try {
      const response = await api.getTransactionHistory(id);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  // --- Handlers ---

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createProduct(newProductData);
      const newId = response.data._id;
      setProductId(newId);
      showMessage(`Product "${response.data.name}" created successfully!`);
      // Clear form
      setNewProductData({ name: '', sku: '', initialStock: 0 });
      // Fetch the newly created product summary
      fetchProductSummary(newId); 
    } catch (error) {
      showMessage(`Creation Failed: ${error.response?.data?.message || 'Check console.'}`);
    }
  };

  const handleStockAction = async (actionType) => {
    if (!productId) return showMessage('Please create or select a product first.');
    if (stockChange <= 0) return showMessage('Quantity must be > 0');

    try {
      let response;
      if (actionType === 'INCREASE') {
        response = await api.increaseStock(productId, stockChange);
      } else if (actionType === 'DECREASE') {
        response = await api.decreaseStock(productId, stockChange);
      }
      
      showMessage(`Stock ${actionType.toLowerCase()}d by ${stockChange}. Current stock: ${response.data.product.currentStock}`);
      // Re-fetch data after successful operation
      fetchProductSummary(productId);
      if (viewHistory) {
        fetchTransactionHistory(productId);
      }

    } catch (error) {
      showMessage(`Action Failed: ${error.response?.data?.message || 'Check console.'}`);
    }
  };

  // Effect to load summary when productId changes
  useEffect(() => {
    if (productId) {
      fetchProductSummary(productId);
      fetchTransactionHistory(productId);
    }
  }, [productId, fetchProductSummary, fetchTransactionHistory]);

  // --- Render Components ---

  const renderProductSummary = () => (
    <div className="product-summary">
      <h3 className="summary-title">Product: {product.productDetails.name}</h3>
      {/* <p>ID: `{product.productDetails._id}`</p> */}
      <p>SKU: {product.productDetails.sku}</p>
      <hr />
      <p className="current-stock">
        Current Stock: <span className="stock-count">{product.currentStock}</span>
      </p>
      <div className="stock-totals">
        <p>Total Increased (including initial): {product.totalIncreased}</p>
        <p>Total Decreased: {product.totalDecreased}</p>
      </div>

      <div className="stock-actions">
        <input 
          type="number" 
          value={stockChange} 
          onChange={(e) => setStockChange(parseInt(e.target.value) || 0)} 
          min="1"
          placeholder="Quantity"
        />
        <button onClick={() => handleStockAction('INCREASE')} className="btn-increase">
          Increase Stock
        </button>
        <button onClick={() => handleStockAction('DECREASE')} className="btn-decrease">
          Decrease Stock
        </button>
      </div>
    </div>
  );

  const renderTransactionHistory = () => (
    <div className="transaction-history">
      <h3 className="history-title">Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className={t.type.toLowerCase()}>
              <td>{t.type}</td>
              <td>{t.quantity}</td>
              <td>{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="app-container">
      <header>
        <h1>Inventory Management</h1>
      </header>

      {message && <div className="message-bar">{message}</div>}

      <div className="card product-creator">
        <h2>Create New Product</h2>
        <form onSubmit={handleCreateProduct}>
          <input 
            type="text" 
            placeholder="Product Name (e.g., Laptop)" 
            required
            value={newProductData.name}
            onChange={(e) => setNewProductData({...newProductData, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="SKU (e.g., LP101)" 
            required
            value={newProductData.sku}
            onChange={(e) => setNewProductData({...newProductData, sku: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Initial Stock (≥ 0)" 
            required
            min="0"
            value={newProductData.initialStock}
            onChange={(e) => setNewProductData({...newProductData, initialStock: parseInt(e.target.value) || 0})}
          />
          <button type="submit">Create Product</button>
        </form>
      </div>

      {/* <div className="card product-selector">
        <h2>Manage Existing Product</h2>
        <input 
          type="text" 
          placeholder="Enter Product ID to View/Manage" 
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div> */}

      {product && (
        <div className="product-manager-container">
          <div className="card product-card">
            {renderProductSummary()}
            <button 
              className="btn-history-toggle"
              onClick={() => {
                setViewHistory(!viewHistory);
                if (!viewHistory) fetchTransactionHistory(productId);
              }}
            >
              {viewHistory ? 'Hide' : 'Show'} Transaction History (GET /products/:id/transactions)
            </button>
          </div>
          
          {viewHistory && transactions && (
            <div className="card transaction-card">
              {renderTransactionHistory()}
            </div>
          )}
        </div>
      )}

      {!product && productId && <div className="card">Loading product or product not found...</div>}
      
    </div>
  );
};

export default App;