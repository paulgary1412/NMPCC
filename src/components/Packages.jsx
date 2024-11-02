// Packages.js

import React, { useState, useEffect } from "react";
import "../assets/Package.css"; // Import the CSS file
import axios from "axios";

const Packages = () => {
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newPackageName, setNewPackageName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null); // State to store the package being edited

  useEffect(() => {
    fetchProducts();
    fetchPackages();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/listing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    selectedProducts.forEach(product => {
      const productData = products.find(item => item._id === product.productId);
      if (productData) {
        total += (productData.price * product.quantity);
      }
    });
    return total - discount;
  };

  const handleAddProduct = () => {
    const exists = selectedProducts.find(item => item.productId === selectedProductId);
    if (exists) {
      setSelectedProducts(prev =>
        prev.map(item =>
          item.productId === selectedProductId
            ? { ...item, quantity }
            : item
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, { productId: selectedProductId, quantity }]);
    }
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const handleAddPackageClick = () => {
    setShowPackageForm(true);
  };

  const handlePackageFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const items = selectedProducts.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      const packageData = {
        name: newPackageName,
        price: calculateTotal(),
        items,
      };

      if (editingPackage) {
        await axios.put(`http://localhost:5000/package/update/${editingPackage._id}`, packageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Package updated successfully!");
        setEditingPackage(null);
      } else {
        await axios.post("http://localhost:5000/package/create", packageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Package created successfully!");
      }

      setShowPackageForm(false);
      setNewPackageName("");
      setSelectedProducts([]);
      setDiscount(0);

      fetchPackages();
    } catch (error) {
      console.error("Error creating/updating package:", error);
      alert("Error creating/updating package. Please try again.");
    }
  };

  const handleUpdatePackage = (pkg) => {
    setEditingPackage(pkg);
    setNewPackageName(pkg.name);
    setDiscount(pkg.discount || 0);
    setSelectedProducts(pkg.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    })));
    setShowPackageForm(true);
  };

  const handleDeletePackage = async (pkgId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/package/${pkgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Package deleted successfully!");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package. Please try again.");
    }
  };

  return (
    <div className="packages-container">
      <button className="add-package-button" onClick={handleAddPackageClick}>
        + Add Package
      </button>

      {showPackageForm && (
        <form onSubmit={handlePackageFormSubmit} className="package-form">
          <h2>{editingPackage ? "Edit Package" : "Create New Package"}</h2>
          <label>
            Package Name:
            <input
              type="text"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              required
            />
          </label>

          <label>
            Select Product:
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">-- Select a Product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - ${product.price.toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </label>
          <button
            type="button"
            className="add-product-button"
            onClick={handleAddProduct}
            disabled={!selectedProductId}
          >
            Add Product
          </button>

          <div className="selected-products-list">
            <h3>Selected Products</h3>
            <ul>
              {selectedProducts.map((item) => (
                <li key={item.productId}>
                  {products.find((p) => p._id === item.productId)?.name} - Quantity: {item.quantity}
                  <button
                    type="button"
                    className="remove-product-button"
                    onClick={() => handleRemoveProduct(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <label>
            Discount:
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            />
          </label>

          <h3>Total Price: ${calculateTotal().toFixed(2)}</h3>

          <button type="submit" className="submit-button">
            {editingPackage ? "Update Package" : "Create Package"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setShowPackageForm(false);
              setEditingPackage(null);
            }}
          >
            Cancel
          </button>
        </form>
        
      )}

<table className="package-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Price</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <tr key={pkg._id}>
                <td><strong>{pkg.name}</strong></td>
                <td>${pkg.price.toFixed(2)}</td>
                <td>
                  <ul>
                    {pkg.items.map((item) => (
                      <li key={item.productId}>
                        {products.find(p => p._id === item.productId)?.name || "Product Not Found"} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="update-button"
                    onClick={() => handleUpdatePackage(pkg)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePackage(pkg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No packages created yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Packages;
