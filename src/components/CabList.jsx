import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from 'base_app/CartSlice';
import './CabList.css';

export default function CabList() {
  const items = useSelector(state => state.inventory.cab);
  const cartItems = useSelector(state => state.cart.cab);
  const dispatch = useDispatch();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
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
      // Remove from cart if quantity becomes 0
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
      <h2 className="section-title">🚗 Available Cab Services</h2>
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