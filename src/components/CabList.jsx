import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from 'base_app/CartSlice';
import './CabList.css';

// Simple local API function
const postToMockAPI = async (endpoint, data, token = '') => {
  try {
    const response = await fetch(`https://68db5a3c23ebc87faa32af49.mockapi.io/users/cab_summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting to mock API:', error);
    throw error;
  }
};

export default function CabList() {
  const items = useSelector(state => state.inventory.cab);
  const cartItems = useSelector(state => state.cart.cab);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Function to post cab summary to mock API
  const sendCabSummaryToAPI = async () => {
    if (cartItems.length === 0) {
      alert('No cab services in cart to send!');
      return;
    }

    const summaryData = {
      username: user.username,
      cabItems: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        price: item.price,
        capacity: item.capacity,
        total: (item.price * item.quantity).toFixed(2)
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
      userToken: user.token
    };

    try {
      console.log('Sending cab summary:', summaryData);
      const result = await postToMockAPI('cab_summary', summaryData, user.token);
      console.log('Cab summary posted successfully:', result);
      alert('Cab summary sent to API successfully!');
    } catch (error) {
      console.error('Failed to post cab summary:', error);
      alert('Failed to send cab summary. Check console for details.');
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      category: 'cab',
      item: { ...item, quantity: 1 }
    }));
  };

  const handleQuantityChange = (item, change) => {
    const currentQuantity = getItemQuantity(item.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      dispatch(updateQuantity({
        category: 'cab',
        id: item.id,
        quantity: 0
      }));
    } else {
      dispatch(updateQuantity({
        category: 'cab',
        id: item.id,
        quantity: newQuantity
      }));
    }
  };

  return (
    <div className="cab-list">
      <div className="cab-header">
        <h2 className="section-title">🚗 Available Cab Services</h2>
        <button 
          className="send-summary-btn"
          onClick={sendCabSummaryToAPI}
          disabled={cartItems.length === 0}
        >
          📤 Send Cab Summary to API
        </button>
      </div>
      <div className="cab-grid">
        {items.map(cab => {
          const quantity = getItemQuantity(cab.id);
          
          return (
            <div key={cab.id} className="cab-card">
              <div className="cab-image">{cab.image}</div>
              
              <div className="cab-info">
                <h3 className="cab-name">{cab.name}</h3>
                <p className="cab-type">{cab.type} • 👥 {cab.capacity} people</p>
                <p className="cab-description">Comfortable and reliable service</p>
                <div className="cab-price">${cab.price}/km</div>
              </div>

              <div className="cab-actions">
                {quantity > 0 ? (
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn minus"
                      onClick={() => handleQuantityChange(cab, -1)}
                    >-</button>
                    <span className="quantity">{quantity}</span>
                    <button 
                      className="qty-btn plus"
                      onClick={() => handleQuantityChange(cab, 1)}
                    >+</button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(cab)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}