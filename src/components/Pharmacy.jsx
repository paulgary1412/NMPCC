import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax

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
  const [userType, setUserType] = useState(null); // Track user type
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [plan, setPlan] = useState("");
  const navigate = useNavigate(); // Use navigate to redirect

  // Fetch data and initialize cart and user type
  useEffect(() => {
    axios
      .get("http://192.168.1.45:5000/pharmacy")
      .then((response) => setData(response.data))
      .catch(() => setError("Error fetching products and packages"));

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedProducts(storedCart);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserType(null); // Reset userType if token is invalid
      }
    }
  }, []);

  // Filter products and packages
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

  const filteredPackages = data.packages.filter((pkg) => {
    const inPriceRange =
      (minPrice === "" || pkg.price >= minPrice) &&
      (maxPrice === "" || pkg.price <= maxPrice);

    return pkg.name.toLowerCase().includes(filterName.toLowerCase()) && inPriceRange;
  });

  // Centralized redirection to checkout
  const redirectToCheckout = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/checkout", { state: { selectedProducts: updatedCart } });
  };

  // Handle "Buy Now" for products
  const handleBuyNow = (product) => {
    if (userType === "member" || userType === "admin") {
      const updatedCart = [...selectedProducts, product];
      redirectToCheckout(updatedCart);
      alert(`${product.name} has been added to your cart!`);
    } else {
      setShowPopup(true); // Show membership popup
    }
  };

  // Handle "Buy Now" for packages
  const handleBuyNow2 = (pkg) => {
    if (userType === "member" || userType === "admin") {
      const updatedCart = [...selectedProducts, pkg];
      redirectToCheckout(updatedCart);
      alert(`${pkg.name} has been added to your cart!`);
    } else {
      setShowPopup(true); // Show membership popup
    }
  };

  // Handle membership upgrade
  const handleUpgradeToMember = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to upgrade to a member.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded.email; // Extract email from token

      const response = await axios.put("http://192.168.1.45:5000/update-usertype", {
        email,
        contact,
        paymentMethod,
        plan,
      });

      if (response.status === 200) {
        alert("Congratulations! You are now a member.");
        setUserType("member"); // Update the local state
        setShowPopup(false); // Close the popup
      }
    } catch (error) {
      console.error("Error upgrading to member:", error);
      alert("Failed to upgrade to a member. Please try again.");
    }
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
                  <p><b>Price</b>: ₱{product.price}</p>
                  <p><b>Quantity</b>: {product.quantity}</p>
                  <p><b>Description</b>:</p>
                  <p>{product.description}</p>
                </div>
                <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}

          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="item-card">
              <div className="image-container">
                <img src={pkg.imageUrl || "default-image-url"} alt="Package" />
                <div className="item-details">
                  <h2>{pkg.name}</h2>
                  <p><b>Price</b>: ₱{pkg.price}</p>
                  <p><b>Quantity</b>: {pkg.quantity}</p>
                  <p><b>Description</b>:</p>
                  <p>{pkg.description}</p>
                </div>
                <button className="buy-now-btn" onClick={() => handleBuyNow2(pkg)}>
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="popup" onClick={(e) => e.target.className === "popup" && setShowPopup(false)}>
          <div className="popup-content">
            <h2>Be a Member</h2>
            <p>Only members can purchase items. Please sign up or upgrade your account.</p>

            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Payment Method:</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Payment Method</option>
                <option value="gcash">GCash</option>
                <option value="landbank">Landbank</option>
              </select>
            </div>

            <div className="form-group">
              <label>Choose Your Plan:</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="">Select Plan</option>
                <option value="Plan A">Plan A (3 months = 100 PHP)</option>
                <option value="Plan B">Plan B (6 months = 180 PHP)</option>
              </select>
            </div>

            <button onClick={handleUpgradeToMember}>Upgrade to Member</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
