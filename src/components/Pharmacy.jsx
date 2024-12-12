import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "./css/Pharmacy.css";
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme CSS
import 'primereact/resources/primereact.min.css';         // Core CSS  
import Notification from "./Notications";

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
  const navigate = useNavigate(); // Use navigate to redirect
  // Snackbar state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState('success'); // State for severity

  useEffect(() => {
    axios
      .get("http://localhost:5000/pharmacy")
      .then((response) => setData(response.data))
      .catch(() => setError("Error fetching products and packages"));

    // Retrieve cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedProducts(storedCart);

    // Decode token to check user type
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Snackbar close handler
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };



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

  // Handle Buy Now for products
  const handleBuyNow = (product) => {
    const updatedCart = [...selectedProducts, product];

    // Save to localStorage to persist cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show custom notification
    setNotificationMessage(`${product.name} has been added to your cart!`);
    setSeverity("success");
    setNotificationOpen(true);
  };

  // Handle Buy Now for packages
  const handleBuyNow2 = (pkg) => {
    if (userType === "member" || userType === "admin") {
      const updatedCart = [...selectedProducts, pkg];

      // Save to localStorage to persist cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Show custom notification
      setNotificationMessage(`${pkg.name} has been added to your cart!`);
      setSeverity("success");
      setNotificationOpen(true);
    } else {
      // Show the membership popup
      setShowPopup(true);
    }
  };
 
  
  const handleUpgradeToMember = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotificationMessage("You need to be logged in to upgrade to a member.");
      setSeverity("danger");
      setNotificationOpen(true)
      return;
    }
  
    try {
      // Decode the JWT token to extract the email
      const decoded = jwtDecode(token);
      const email = decoded.email; // Extract email from token
  
          const response = await axios.put("http://10.11.38.202:5000/update-usertype", {
     
      email,
      contact,
      paymentMethod,
      plan,
    });

      if (response.status === 200) {
        setNotificationMessage("Congratulations! You are now a member.");
        setNotificationOpen(true)
        setUserType("member"); // Update the local state to reflect membership
        setShowPopup(false); // Close the popup
      }
    } catch (error) {
      console.error("Error upgrading to member:", error);
      setNotificationMessage("Failed to upgrade to a member. Please try again.");
      setSeverity("danger");
      setNotificationOpen(true)
    }
  };
  
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [plan, setPlan] = useState("");


  return (
    <div className="pharmacy-container">
      {error && <p className="error-message">{error}</p>}

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        handleClose={handleCloseNotification}
        severity={severity}
      />

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
        <div>
        <input
          type="text"
          placeholder="Search Name"
          style={{marginLeft: '700px'}}
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        </div>

        <div className="items-container">
          {filteredProducts.map((product) => (
            <div key={product._id} className="item-card">
              <div className="image-container">
                <img src={product.imageUrl || "default-image-url"} alt="Product" />
                <div className="item-details">
                <h2 style={{ fontSize: '15px', color: 'black  '}}>{product.name}</h2>
                  <p><b>Price </b>: ₱{product.price}</p>
                  <p><b>Quantity:</b> {product.quantity}</p>
                  <p><b>Description :</b></p>
                  <p className="description">{product.description}</p>
                </div>
                <Button
                  severity="info"
                  className="buy-now-btn"
                  onClick={() => handleBuyNow(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}

          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className="item-card">
              <div className="image-container">
                <img src={pkg.imageUrl || "default-image-url"} alt="Package" />
                <div className="item-details">
                <h2 style={{ fontSize: '17px', color: 'blue'}}>{pkg.name}</h2>
                  <p><b>Price </b>: ₱{pkg.price}</p>
                  <p><b>Quantity:</b> {pkg.quantity}</p>
                  <p><b>Description :</b></p>
                  <p><b>{pkg.description}</b></p>
                </div>
                <Button
                  severity="info"
                  className="buy-now-btn"
                  onClick={() => handleBuyNow2(pkg)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2>Be a Member</h2>
      <p>Only members can purchase items. Please sign up or upgrade your account.</p>
      
      <form onSubmit={handleUpgradeToMember}>
        {/* Email Input */}
      
        
        {/* Contact Input */}
        <div className="form-group">
          <label htmlFor="contact">Contact Number:</label>
          <input 
            type="text" 
            id="contact" 
            name="contact"
            placeholder="Enter your contact number"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        
        {/* Payment Method Input */}
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select 
            id="paymentMethod" 
            name="paymentMethod" 
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="gcash">GCash</option>
            <option value="landbank">Landbank</option>
          </select>
        </div>

        {/* Plans Input */}
        <div className="form-group">
          <label htmlFor="plan">Choose Your Plan:</label>
          <select 
            id="plan" 
            name="plan" 
            required
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="">Select Plan</option>
            <option value="Plan A">Plan A (3 months = 100 PHP)</option>
            <option value="Plan B">Plan B (6 months = 180 PHP)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="popupbutton">
          <button type="submit">Upgrade to Member</button>
          <button type="button" onClick={() => setShowPopup(false)}>Close</button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default Pharmacy;
