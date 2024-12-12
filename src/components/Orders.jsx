import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax
import { useNavigate } from "react-router-dom";
import "./css/AdminOrder.css"; // Add your CSS styles
import Notification from "./Notifications";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const navigate = useNavigate();

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  }

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
          <div key={index} className="order-card2">
            <h2>Order ID #{index + 1}</h2>
            <h3>Products:</h3>
            <div className="productcontainer">
               
                        <ul>
              {order.selectedProducts.map((product, idx) => (
                <li key={idx}>
                  
                  <div className="img-container">
                    <img style={{width: '100%', maxWidth: '140px', height: 'auto', maxHeight: '140px'}}src={product.imageUrl || "default-image-url"} alt="Package" />
                  </div>
                  {product.name} - {product.quantity} x ₱{product.price}
                    </li>
                    
                  ))}
                      {/* Calculate and display the total */}
                    
                    </ul>
                    </div>
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
                    <div className="total-amount">
                        <h3>      
               Total Amount: ₱
              {order.selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0)}
               </h3>
             
          </div>
            </div>
          ))
        )}

        </div>
    </div>
  );
};

export default Orders;
