import React from "react";
import "../assets/Modal.css";

const Modal = ({ showModal, onClose, onSubmit, product, handleInputChange }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Update Product</h2>
        <form onSubmit={onSubmit}>
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
               onChange={handleInputChange} // Use a separate handler for file input
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
