import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Cart.css";

const Cart = () => {
  const { state } = useLocation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedProducts(storedCart);
    setSelectedIndexes(storedCart.map((_, index) => index)); // Select all by default
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = Math.max(1, newQuantity);
    setSelectedProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const handleDelete = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleCheckboxChange = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedIndexes.length === selectedProducts.length) {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(selectedProducts.map((_, index) => index));
    }
  };

  const totalPrice = selectedProducts.reduce((total, product, index) => {
    if (selectedIndexes.includes(index)) {
      return total + product.price * product.quantity;
    }
    return total;
  }, 0);

  return (
    <div className="cart-container">
      <div className="cart-content">
        
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
        <h1>Shopping Cart</h1>
      
        </button>

        {selectedProducts.length > 0 ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIndexes.length === selectedProducts.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Image</th>
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
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIndexes.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                    <img
                    src={product.picture ? `http://localhost:5000/${product.picture}` : "https://via.placeholder.com/150"}
                    alt={product.name || "Product"}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                  />
                    </td>
                    <td>{product.name}</td>
                    <td>₱{product.price}</td>
                    <td>
                      <input
                        type="number"
                        value={product.quantity || 1} 
                        min="1"
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="quantity-input"
                      />
                    </td>
                    <td>
  ₱{
    (() => {
      const price = parseFloat(product.price);
      const quantity = parseInt(product.quantity, 10);
      // Only calculate the total if both price and quantity are valid numbers
      if (!isNaN(price) && !isNaN(quantity)) {
        return price * quantity;
      }
      return price; // Return 0 if either price or quantity is invalid
    })()
  }
</td>
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

            <div className="cart-footer">
            
              
              <h2>Total: ₱{totalPrice}</h2>
              <button
                className="checkout-btn"
                onClick={() =>
                  navigate("/checkout", {
                    state: { selectedProducts: selectedIndexes.map((i) => selectedProducts[i]) },
                  })
                }
              >
                Proceed to Checkout
              </button>
              
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <h2>Your cart is empty!</h2>
            <p>Browse our catalog and add items to your cart.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
