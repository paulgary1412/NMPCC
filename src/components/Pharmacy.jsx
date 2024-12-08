import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "./css/Pharmacy.css";

const Pharmacy = () => {
  const [data, setData] = useState({ products: [], packages: [] });
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [category, setCategory] = useState("all"); // Track category filter
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]); // Track selected products
  const navigate = useNavigate(); // Use navigate to redirect
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/pharmacy")
      .then((response) => setData(response.data))
      .catch(() => setError("Error fetching products and packages"));
    
    // Retrieve cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedProducts(storedCart);
  }, []);

  // Filter products based on name, price range, and category
  const filteredProducts = data.products.filter((product) => {
    const inPriceRange =
      (minPrice === "" || product.price >= minPrice) &&
      (maxPrice === "" || product.price <= maxPrice);

    const matchesCategory =
      category === "all" || product.type.toLowerCase() === category.toLowerCase();

    return (
      product.name.toLowerCase().includes(filterName.toLowerCase()) &&
      inPriceRange &&
      matchesCategory
    );
  });

  // Filter packages based on name and price range
  const filteredPackages = data.packages.filter((pkg) => {
    const inPriceRange =
      (minPrice === "" || pkg.price >= minPrice) &&
      (maxPrice === "" || pkg.price <= maxPrice);

    return pkg.name.toLowerCase().includes(filterName.toLowerCase()) && inPriceRange;
  });

 

  // Handle Buy Now
  const handleBuyNow = (product) => {
    const updatedCart = [...selectedProducts, product];
   

    // Save to localStorage to persist cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show a built-in alert notification
    alert(`${product.name} has been added to your cart!`);

    // Navigate to checkout page
    navigate("/checkout", { state: { selectedProducts: updatedCart } });
  };

  return (
    <div className="pharmacy-container">
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
     
        <h1>Filter</h1>
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
        
      <p>Search</p>
        <input
          type="text"
          placeholder="Search Name"
          className="filter-input"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

          <div className="items-container">
            {filteredProducts.map((product) => (
              <div key={product._id} className="item-card">
                <div className="image-container">
                <img src={product.imageUrl || "default-image-url"} alt="Product" />
                  <div className="item-details">
                    <h2>{product.name}</h2>
                    <p><b>Price </b>: ₱{product.price}</p>
                    <p><b>Quantity:</b> {product.quantity}</p>
                    <p><b>Description :</b>{product.description}</p>
                   
                  </div>
                  <div className="button-group">
                </div>
               
                    
                    <button
                      className="buy-now-btn"
                      onClick={() => handleBuyNow(product)} // Add onClick for Buy Now
                    >
                      Buy Now
                    </button>
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
                <p>Description : {pkg.description}</p>
                <p>Quantity :{pkg.quantity}</p>
                <p>Price: ₱{pkg.price}</p>
                <div className="button-group">
              
                  <button
                    className="buy-now-btn"
                    onClick={() => handleBuyNow(pkg)} // Add onClick for Buy Now
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
       
      </div>
    </div>
  );
};

export default Pharmacy;
