import React from "react";


const products = [
  { name: "T-shirt for Men", price: "$90.00" },
  { name: "Travel Bag Jeans", price: "$19.50" },
  { name: "Jeans Shorts", price: "$70.00" },
  { name: "Sofa for Interior", price: "$375.00" },
  { name: "Leather Wallet", price: "$375.00" },
  { name: "Smartwatch", price: "$250.00" },
  { name: "Bluetooth Headphones", price: "$120.00" },
  { name: "Winter Jacket", price: "$130.00" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li>Products</li>
          <li>Orders</li>
          <li>Customers</li>
          <li>Statistics</li>
          <li>Reviews</li>
          <li>Transactions</li>
          <li>Sellers</li>
        </ul>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <div className="actions">
            <button className="create-new">+ Create New</button>
            <button className="export">Export</button>
          </div>
          <div className="search">
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="products-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <img
                src="https://via.placeholder.com/150"
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <div className="actions2">
                  <button>Edit</button>
                  <button className="delete">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
