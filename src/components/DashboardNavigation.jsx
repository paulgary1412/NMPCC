// DashboardNavigation.jsx
import React, { useState } from "react";
import "../assets/DashboardNavigation.css";
import { FaShoppingCart,FaBox,FaClipboardList,FaDashcube} from 'react-icons/fa';

const DashboardNavigation = ({ setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
   
        <div
          className={`dashboard-nav-buttons ${isCollapsed ? "collapsed" : ""}`}
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
        >
         <span>
        {isCollapsed ? <FaDashcube size={40} /> : "Dash\n Board"}
      </span>
          <button onClick={() => setActiveSection("products")}>
            {isCollapsed ? <FaShoppingCart size={24} /> : "Products"}
          </button>
          <button onClick={() => setActiveSection("packages")}>
            {isCollapsed ? <FaBox size={24} /> : "Packages"}
          </button>
          <button onClick={() => setActiveSection("orders")}>
            {isCollapsed ? <FaClipboardList size={24} /> : "Orders"}
          </button>
        </div>
  );
};

export default DashboardNavigation;
