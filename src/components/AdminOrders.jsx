import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./css/Orders.css"; // Update this to include styles

const AdminOrders = () => {
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

        const response = await axios.get("http://192.168.1.110:5000/checkout/");
        setOrders(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdate = async (orderId, newStatusOrder, newStatusInfo) => {
    try {
      const response = await axios.put(`http://192.168.1.110:5000/checkout/update/${orderId}`, {
        statusOrder: newStatusOrder,
        statusInfo: newStatusInfo,
      });

      setOrders(orders.map(order => 
        order._id === orderId 
        ? { ...order, statusOrder: newStatusOrder, statusInfo: newStatusInfo } 
        : order
      ));
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order.");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://192.168.1.110:5000/checkout/delete/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order.");
    }
  };

  const handleStatusChange = (orderId, event) => {
    const selectedStatus = event.target.value;
    const statusInfo = selectedStatus === "Accepted" ? "Order is being processed" : "Order has been declined";
    handleUpdate(orderId, selectedStatus, statusInfo);
  };

  const handleStatusInfoChange = (orderId, event) => {
    const updatedStatusInfo = event.target.value;
    setOrders(orders.map(order =>
      order._id === orderId ? { ...order, statusInfo: updatedStatusInfo } : order
    ));
  };

  const handleStatusInfoUpdate = (orderId) => {
    const updatedOrder = orders.find(order => order._id === orderId);
    if (updatedOrder) {
      handleUpdate(orderId, updatedOrder.statusOrder, updatedOrder.statusInfo);
    }
  };

  if (loading) {
    return <div className="orders-page"><p>Loading your orders...</p></div>;
  }

  if (error) {
    return <div className="orders-page"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="sample">
    <h1 className="page-title">Manage Orders</h1>
    <div className="orders-page">
   
      {orders.length === 0 ? (
        <p className="no-orders">You have no orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <h2 className="order-title">AdminOrder #{index + 1}</h2>
            <p><strong>AdminName:</strong> {order.contactInfo.name}</p>
            <p><strong>Email:</strong> {order.contactInfo.email}</p>
            <p><strong>Phone:</strong> {order.contactInfo.phone}</p>
            <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Total Amount:</strong> ₱{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.statusOrder}</p>

            {/* Editable statusInfo (text box) */}
            <label htmlFor={`statusInfo-${order._id}`}><strong>Information:</strong></label>
            <input 
              type="text" 
              id={`statusInfo-${order._id}`} 
              value={order.statusInfo} 
              onChange={(e) => handleStatusInfoChange(order._id, e)} 
              className="status-info-input"
            />
            
            {/* Update Button for statusInfo */}
            <button 
              onClick={() => handleStatusInfoUpdate(order._id)} 
              className="update-status-info-button"
            >
              Update Info
            </button>
            
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <h3>Products:</h3>
            <div className="productcontainer2">
            <ul>
              {order.selectedProducts.map((product, idx) => (
                <li key={idx}>
                  {product.name} - {product.quantity} x ₱{product.price}
                </li>
              ))}
            </ul>
</div>
            {/* Dropdown for status update */}
            <select onChange={(event) => handleStatusChange(order._id, event)} defaultValue={order.statusOrder} className="status-select">
              <option value="Accepted">Accept</option>
              <option value="Declined">Decline</option>
            </select>

            {/* Delete Order Button */}
            <button onClick={() => handleDelete(order._id)} className="delete-order-button">Delete Order</button>
          </div>
        ))
      )}
 
    </div>
    </div>
  );
};

export default AdminOrders;
