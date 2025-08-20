import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        // Get cart counts from localStorage
        const cartCounts = JSON.parse(localStorage.getItem('cartCounts')) || {};
        
        // Get all food items from localStorage or fetch if not available
        let allFoodItems = JSON.parse(localStorage.getItem('allFoodItems'));
        
        if (!allFoodItems) {
          const response = await fetch('http://localhost:5000/auth/getfood');
          const data = await response.json();
          allFoodItems = data;
          localStorage.setItem('allFoodItems', JSON.stringify(data));
        }

        // Create cart items array with full details
        const itemsWithDetails = Object.entries(cartCounts)
          .filter(([_, count]) => count > 0)
          .map(([id, count]) => {
            const foodItem = allFoodItems.find(item => item._id === id);
            return foodItem ? {
              id,
              name: foodItem.foodname,
              price: foodItem.price,
              count,
              image: foodItem.foodpicture
            } : null;
          })
          .filter(item => item !== null); // Remove any null entries

        setCartItems(itemsWithDetails);

        // Calculate subtotal
        const total = itemsWithDetails.reduce(
          (acc, item) => acc + (item.price * item.count),
          0
        );
        setSubtotal(total);
      } catch (error) {
        console.error('Error loading cart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartData();
  }, []);

  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const newCount = item.count + change;
          return {
            ...item,
            count: newCount >= 0 ? newCount : 0
          };
        }
        return item;
      }).filter(item => item.count > 0); // Remove items with zero quantity

      // Update localStorage
      const updatedCounts = {};
      updatedItems.forEach(item => {
        updatedCounts[item.id] = item.count;
      });
      localStorage.setItem('cartCounts', JSON.stringify(updatedCounts));

      // Update subtotal
      const newSubtotal = updatedItems.reduce(
        (acc, item) => acc + (item.price * item.count),
        0
      );
      setSubtotal(newSubtotal);

      return updatedItems;
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      const updatedCounts = {};
      updatedItems.forEach(item => {
        updatedCounts[item.id] = item.count;
      });
      localStorage.setItem('cartCounts', JSON.stringify(updatedCounts));

      const newSubtotal = updatedItems.reduce(
        (acc, item) => acc + (item.price * item.count),
        0
      );
      setSubtotal(newSubtotal);

      return updatedItems;
    });
  };

  const billing = () => {
    const totalbill=subtotal+50
    localStorage.setItem("total",totalbill)
    navigate('/bill');
  };

  if (isLoading) {
    return <div className="cart-page">Loading your cart...</div>;
  }

  return (
    <div className="cart-page">
      <center>
        <h2 className="cart-head">Your Cart</h2>
      </center>

      <div className="cart-table">
        {cartItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.count}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>₹{(item.price * item.count).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button 
              onClick={() => navigate('/')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="total-calculation">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹50.00</span>
            </div>
            <div className="summary-row grand-total">
              <span>Total:</span>
              <span id="subtotal">₹{(subtotal + 50).toFixed(2)}</span>
            </div>
            <button className="order-button" onClick={billing}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;