import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Checkout.css";  // Make sure this CSS file is correctly imported

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    setTotalAmount(total);
  }, [selectedProducts]);

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const handleConfirmation = () => {
    alert("Purchase confirmed! Thank you for your order.");
    navigate("/");  // Redirect to home or any other page
  };

  return (
    <div className="checkout-page">
      <div className="confirmation-container">
        <h1>Checkout</h1>
        <div className="product-list">
          <h2>Your Products</h2>
          {selectedProducts.length === 0 ? (
            <p>No products selected</p>
          ) : (
            selectedProducts.map((product, index) => (
              <div key={index} className="product-item">
                <h3>{product.name}</h3>
                <p>Price: ₱{product.price}</p>
                <p>Current Quantity: {product.quantity}</p>

                {/* Input for the user to change the quantity */}
                <label htmlFor={`quantity-${index}`}>Quantity:</label>
                <input
                  id={`quantity-${index}`}
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}  // Prevent non-numeric input
                  className="quantity-input"
                />
                
              </div>
            ))
          )}
        </div>

        <div className="total-amount">
          <h3>Total Amount: ₱{totalAmount}</h3>
        </div>

        <button onClick={handleConfirmation} className="confirm-button">
          Confirm Purchase
        </button>
      </div>
    </div>
  );
};

export default Checkout;
