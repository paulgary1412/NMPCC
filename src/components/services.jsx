import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import syntax


export const Services = (props) => {
  const servicesData = [
    { icon: "fa-wordpress", title: "Products", link: "/pharmacy", description: "" },
    { icon: "fa-database", title: "Database", link: "/dashboard", description: "" },
  ];

  // Function to check if the user is an admin
  const checkAdminAccess = () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (!token) return false; // If no token, deny access

      const decodedToken = jwtDecode(token); // Decode the token
      return decodedToken.usertype === "admin"; // Check if usertype is 'admin'
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // In case of error, deny access
    }
  };


  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            
          </p>
        </div>
        <div className="row">
          {servicesData.map((service, index) => (
            <div key={index} className="col-md-4">
              {/* Only show the 'Database' link if the user is an admin */}
              {service.link === "/dashboard" && !checkAdminAccess() ? (
                <p></p>
              ) : (
                <Link to={service.link}>
                  <i className={`fa ${service.icon}`}></i>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
