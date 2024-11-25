import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";  // Add useNavigate for navigation
import "./css/Cart.css";

const Cart = () => {
  const { state } = useLocation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();  // For navigating to checkout page

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedProducts(storedCart);
  }, []);

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));  // Update cart in localStorage
  };

  // Handle deleting an item from the cart
  const handleDelete = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));  // Update cart in localStorage
  };

  // Calculate total price
  const totalPrice = selectedProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <div className="cart-content">
        <h1>Shopping Cart</h1>
        {selectedProducts.length > 0 ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>₱{product.price}</td>
                    <td>
                      <input
                        type="number"
                        value={product.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="quantity-input"
                      />
                    </td>
                    <td>₱{product.price * product.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(index)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-total">
              <h2>Total: ₱{totalPrice}</h2>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout", { state: { selectedProducts } })} // Navigate to checkout page
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
