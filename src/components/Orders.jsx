import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax
import { useNavigate } from "react-router-dom";
import "./css/AdminOrder.css"; // Add your CSS styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in. Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:5000/checkout/${userId}`);
        setOrders(response.data.data); // Assuming `data` contains the list of orders
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-page"><p>Loading your orders...</p></div>;
  }

  if (error) {
    return <div className="orders-page"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="sample">
          <h1>Your Orders</h1>
    <div className="orders-page">
  
      {orders.length === 0 ? (
        <p className="no-orders">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <h2>Order #{index + 1}</h2>
            <p><strong>Name:</strong> {order.contactInfo.name}</p>
            <p><strong>Email:</strong> {order.contactInfo.email}</p>
            <p><strong>Phone:</strong> {order.contactInfo.phone}</p>
            <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Total Amount:</strong> ₱{order.totalAmount}</p>
            {/* Add createdAt here */}
<p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
<p><strong>Status:</strong> {order.statusOrder}</p>
<p><strong>Information:</strong> {order.statusInfo}</p>
            <h3>Products:</h3>
            <ul>
              {order.selectedProducts.map((product, idx) => (
                <li key={idx}>
                  {product.name} - {product.quantity} x ₱{product.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

    </div>
    </div>
  );
};

export default Orders;
