// Pharmacy.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/pharmacy.css";

const Pharmacy = () => {
  const [data, setData] = useState({ products: [], packages: [] });
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/pharmacy")
      .then((response) => setData(response.data))
      .catch((error) => setError("Error fetching products and packages"));
  }, []);

  // Filtered items based on the static filter
  const filteredProducts = data.products.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );
  const filteredPackages = data.packages.filter(pkg =>
    pkg.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="pharmacy-container">
      {error && <p className="error-message">{error}</p>}
      
      <h2>Our Pharmacy Products</h2>
      
      <input
        type="text"
        placeholder="Filter by name"
        className="filter-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="section">
        <h3>Products</h3>
        <div className="items-container">
          {filteredProducts.map((product) => (
            <div key={product._id} className="item-card">
              <img src="https://via.placeholder.com/150" alt="Product" className="item-image" />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="button-group">
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="buy-now-btn">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Packages</h3>
        <div className="items-container">
          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="item-card">
              <img src="https://via.placeholder.com/150" alt="Package" className="item-image" />
              <h4>{pkg.name}</h4>
              <p>{pkg.description}</p>
              <div className="button-group">
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="buy-now-btn">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
