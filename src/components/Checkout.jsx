import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Checkout.css";
import axios from "axios";
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);
  const [totalAmount, setTotalAmount] = useState(0);

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('');

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

  const handleConfirmation = async () => {
    const checkoutData = {
      contactInfo,
      selectedProducts,
      deliveryMethod,
      paymentMethod,
      totalAmount,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/checkout", checkoutData);
      alert(response.data.message); // Display success message
      navigate("/"); // Redirect to home or another page
    } catch (error) {
      console.error("Error saving checkout data:", error);
      alert("Failed to confirm purchase. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column - Products List */}
        <div className="left-column">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <h1 className="checkout-title">Your Products</h1>
          </button>
          {selectedProducts.length === 0 ? (
            <p className="empty-cart">No products selected</p>
          ) : (
            selectedProducts.map((product, index) => (
              <div className="product-item" key={index}>
                <img
                  src={
                    product.image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf8rMSNgrBv_1VqNVcrAgmgEMv4BnBA10aQw&s"
                  }
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-details">
                  {/* Item Number */}
                  <h3 className="product-name">
                    {index + 1}. {product.name} {/* Add item number */}
                  </h3>
                  <p className="product-price">Price: ₱{product.price}</p>
                </div>
              </div>
            ))
          )}
          <div className="total-amount">
            <h3>Total Amount: ₱{totalAmount}</h3>
          </div>
        </div>

        {/* Right Column - Forms for Contact, Delivery, and Payment */}
        <div className="right-column">
          <h2>Contact Information</h2>
          <form>
            <label>Name:</label>
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              className="input-field"
              required
            />
            <label>Email:</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="input-field"
              required
            />
            <label>Phone:</label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="input-field"
              required
            />

            <h2>Delivery Method</h2>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Delivery Method</option>
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
            </select>

            <h2>Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </form>

          <button onClick={handleConfirmation} className="confirm-button">
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
