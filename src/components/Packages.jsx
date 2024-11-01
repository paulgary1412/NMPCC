import React, { useState, useEffect } from "react";
import "../assets/Package.css"; // Import the CSS file
import axios from "axios";

const Packages = () => {
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newPackageName, setNewPackageName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchProducts(); // Load products for package selection
    fetchPackages(); // Load existing packages
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

  const handleProductSelection = (productId, quantity) => {
    setSelectedProducts((prev) => {
      const exists = prev.find(item => item.productId === productId);
      if (exists) {
        return prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { productId, quantity }];
      }
    });
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

      await axios.post("http://localhost:5000/package/create", packageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Package created successfully!");
      setShowPackageForm(false);
      setNewPackageName("");
      setSelectedProducts([]);
      setDiscount(0);

      // Fetch packages again to refresh the list
      fetchPackages();
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Error creating package. Please try again.");
    }
  };
//cant update atm need implement
  const handleUpdatePackage = async (pkgId) => {
    // Implement your update package logic here
    console.log("Update package:", pkgId);
  };
//cant delete atm need to implement
  const handleDeletePackage = async (pkgId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/package/${pkgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Package deleted successfully!");
      fetchPackages(); // Refresh the packages list after deletion
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package. Please try again.");
    }
  };
//need to be centered this form below
  return (
    <div className="packages-container">
    
      <button className="add-package-button" onClick={handleAddPackageClick}>
        + Add Package
      </button>
      
      {showPackageForm && (
        <form onSubmit={handlePackageFormSubmit} className="package-form">
          <h2>Create New Package</h2>
          <label>
            Package Name:
            <input
              type="text"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              required
            />
          </label>

          <h3>Select Products to Include:</h3>
          <div className="product-selection">
            {products.map((product) => (
              <div key={product._id}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleProductSelection(product._id, 1); // Default to 1 quantity
                    } else {
                      setSelectedProducts((prev) =>
                        prev.filter((item) => item.productId !== product._id)
                      );
                    }
                  }}
                />
                {product.name} - ${product.price.toFixed(2)}
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  onChange={(e) =>
                    handleProductSelection(product._id, parseInt(e.target.value))
                  }
                />
              </div>
            ))}
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

          <button type="submit" className="submit-button">Create Package</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowPackageForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Display Created Packages in a Table */}
  
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
                    onClick={() => handleUpdatePackage(pkg._id)}
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
