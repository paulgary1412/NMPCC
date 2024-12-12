import React, { useState } from "react";
import "../assets/Modal.css";

const Modal = ({ showModal, onClose, onSubmit, product, handleInputChange }) => {
  if (!showModal) return null;

  // To handle file input separately
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      // Update product with the file (image)
      handleInputChange({ target: { name: "imageUrl", value: file } });
    }
  };

  // Function for form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Trigger onSubmit passed as a prop, which will update or create the listing
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Update Product</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="picture">Picture</label>
            <input
              type="file" // Change type to "file"
              name="picture"
              accept="image/*" // Restrict to image files
              onChange={handleFileChange} // Separate handler for file input
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={product.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select type</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button3">Update</button>
            <button type="button" onClick={onClose} className="cancel-button3">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
