import React, { useState } from "react";
import "../assets/DashboardNavigation.css";
import { FaShoppingCart, FaBox, FaClipboardList, FaDashcube } from "react-icons/fa";

const DashboardNavigation = ({ setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`dashboard-nav-buttons ${isCollapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Dashboard Label */}
      <span className={isCollapsed ? "collapsed" : ""}>
        {isCollapsed ? (
          <FaDashcube size={40} aria-label="Dashboard Icon" />
        ) : (
          <span>Dashboard</span>
        )}
      </span>

      {/* Navigation Buttons */}
      <button onClick={() => setActiveSection("products")} aria-label="Products">
        {isCollapsed ? (
          <FaShoppingCart size={24} aria-label="Products Icon" />
        ) : (
          "Products"
        )}
      </button>

      <button onClick={() => setActiveSection("packages")} aria-label="Packages">
        {isCollapsed ? (
          <FaBox size={24} aria-label="Packages Icon" />
        ) : (
          "Packages"
        )}
      </button>

      <button onClick={() => setActiveSection("AdminOrders")} aria-label="Orders">
        {isCollapsed ? (
          <FaClipboardList size={24} aria-label="Orders Icon" />
        ) : (
          "AdminOrders"
        )}
      </button>
    </div>
  );
};

export default DashboardNavigation;
