import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/AddToCartPage.css";

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Retrieve cart items from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Handle item quantity update
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle item removal from cart
  const removeItemFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle checkout navigation
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-page-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>Price: ₱{item.price}</p>
                <div className="quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p>Total: ₱{item.price * item.quantity}</p>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItemFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <button className="checkout-btn" onClick={proceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddToCartPage;
