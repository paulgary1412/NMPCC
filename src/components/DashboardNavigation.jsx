// DashboardNavigation.jsx
import React from "react";
import "../assets/DashboardNavigation.css"; // Import the CSS file

const DashboardNavigation = ({ setActiveSection }) => {
  return (
    <div className="dashboard-nav-buttons">
      <button onClick={() => setActiveSection("products")}>Products</button>
      <button onClick={() => setActiveSection("packages")}>Packages</button>
      <button onClick={() => setActiveSection("orders")}>Orders</button>
    </div>
  );
};

export default DashboardNavigation;
