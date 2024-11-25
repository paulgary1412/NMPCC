import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/pharmacy.css";

const Pharmacy = () => {
  const [data, setData] = useState({ products: [], packages: [] });
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterType] = useState("all");
  const [category, setCategory] = useState("all"); // Track category filter
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/pharmacy")
      .then((response) => setData(response.data))
      .catch(() => setError("Error fetching products and packages"));
  }, []);

  // Filter products based on name, price range, and category
  const filteredProducts = data.products.filter((product) => {
    const inPriceRange =
      (minPrice === "" || product.price >= minPrice) &&
      (maxPrice === "" || product.price <= maxPrice);

    const matchesCategory =
      category === "all" || product.type.toLowerCase() === category.toLowerCase();

    return (
      (filterType === "all" || filterType === "products") &&
      matchesCategory &&
      product.name.toLowerCase().includes(filterName.toLowerCase()) &&
      inPriceRange
    );
  });

  // Filter packages based on name and price range
  const filteredPackages = data.packages.filter((pkg) => {
    const inPriceRange =
      (minPrice === "" || pkg.price >= minPrice) &&
      (maxPrice === "" || pkg.price <= maxPrice);

    return (
      (filterType === "all" || filterType === "packages") &&
      pkg.name.toLowerCase().includes(filterName.toLowerCase()) &&
      inPriceRange
    );
  });

  return (
    <div className="pharmacy-container">
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <h1>Filter</h1>

        {/* Category filter */}
        <p>Category</p>
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Grocery">Grocery</option>
          <option value="packages">Packages</option>
        </select>

        {/* Name filter */}
        <p>Product</p>
        <input
          type="text"
          placeholder="Name"
          className="filter-input"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        {/* Price filter */}
        <p>Price</p>
        <input
          type="number"
          placeholder="Min Price"
          className="filter-input"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="filter-input"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="divider-container">
        <div className="divider1"></div>
        <div className="section">
          <div className="items-container">
            {filteredProducts.map((product) => (
              <div key={product._id} className="item-card">
                <div className="image-container">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf8rMSNgrBv_1VqNVcrAgmgEMv4BnBA10aQw&s"
                    alt="Product"
                    className="item-image"
                  />
                  <div className="item-details">
                    <h2>{product.name}</h2>
                    <p>Price: ₱{product.price}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>{product.description}</p>
                    <div className="button-group">
                      <button className="add-to-cart-btn">Add to Cart</button>
                      <button className="buy-now-btn">Buy Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredPackages.map((pkg) => (
              <div key={pkg._id} className="item-card2">
                <img
                  src="https://www.apsfulfillment.com/wp-content/uploads/2017/06/APS-Fulfillment-Inc-j.jpg"
                  alt="Package"
                  className="item-image"
                />
                <h4>{pkg.name}</h4>
                <p>{pkg.description}</p>
                <p>Price: ₱{pkg.price}</p>
                <div className="button-group">
                  <button className="add-to-cart-btn">Add to Cart</button>
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
