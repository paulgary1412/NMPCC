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

  return (
    <div className="dashboard-container1">
      <h1>Create Package</h1>
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

      {/* Display Created Packages */}
      <h2>Created Packages</h2>
      <ul className="package-list">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <li key={pkg._id}>
              <strong>{pkg.name}</strong> - Price: ${pkg.price.toFixed(2)}
              <ul>
                {pkg.items.map((item) => (
                  <li key={item.productId}>
                    {
                      // Displaying the product name for each item in the package
                      products.find(p => p._id === item.productId)?.name || "Product Not Found"
                    } - Quantity: {item.quantity} - Price: ${products.find(p => p._id === item.productId)?.price.toFixed(2) || "N/A"}
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p>No packages created yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Packages;
