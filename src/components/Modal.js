// Modal.js
import React from "react";
import "../assets/Modal.css"; // Optional: Add styles for your modal

const Modal = ({ showModal, onClose, onSubmit, product, handleInputChange }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Product</h2>
        <form onSubmit={onSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Type:
            <select
              name="type"
              value={product.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select type</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Grocery">Grocery</option>
            </select>
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Update Listing</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
