import React from "react";
import { Link } from "react-router-dom";

export const Services = (props) => {
  const servicesData = [
    { icon: "fa-wordpress", title: "Pharmacy", link: "/pharmacy", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam." },
    { icon: "fa-shopping-cart", title: "Grocery", link: "/shopping", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam." },
    { icon: "fa-database", title: "Database", link: "/dashboard", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam." },
  ];

  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <div className="row">
          {servicesData.map((service, index) => (
            <div key={index} className="col-md-4">
              <Link to={service.link}>
                <i className={`fa ${service.icon}`}></i>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
