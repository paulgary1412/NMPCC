import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Dashboard.css"; // Import the CSS file
import Modal from "./Modal"; // Import your Modal component
import DashboardNavigation from "./DashboardNavigation"; // Import the DashboardNavigation component
import Packages from "./Packages"; // Import the Packages component
import Orders from "./Orders"; // Import the Orders component

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("products"); // Track the active section
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    picture: null,
    quantity: "",
    type: "",
    price: "",
  });
  const [listings, setListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddProductClick = () => {
    setShowForm(true);
    setNewProduct({ name: "", picture: null, quantity: "", type: "", price: "" });
    setEditingListingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture") {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        picture: files[0], // Store the selected file in the state
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  // Handler for file input changes (to upload an image)

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("quantity", newProduct.quantity);
    formData.append("type", newProduct.type);
    formData.append("price", newProduct.price);
    if (newProduct.picture) {
      formData.append("picture", newProduct.picture);
    }
  
    const requestConfig = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    };

    if (editingListingId) {
      // Update existing listing
      try {
        await axios.put(
          `http://localhost:5000/listing/update/${editingListingId}`,
          formData,
          requestConfig
        );
        alert("Listing updated successfully!");
      } catch (error) {
        console.error("Error updating listing:", error);
        alert("Error updating listing. Please try again.");
      }
    } else {
      // Create new listing
      try {
        await axios.post(
          "http://localhost:5000/listing/create",
          formData,
          requestConfig
        );
        alert("Listing created successfully!");
      } catch (error) {
        console.error("Error creating listing:", error);
        alert("Error creating listing. Please try again.");
      }
    }

    setNewProduct({ name: "", picture: null, quantity: "", type: "", price: "" });
    setShowForm(false);
    fetchListings(); // Refresh the listings
  };

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/listing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleUpdate = (id, listing) => {
    setEditingListingId(id);
    setNewProduct(listing);
    setShowModal(true); // Show the modal for updating
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    await handleFormSubmit(e); // Call the form submit handler
    setShowModal(false); // Close the modal after submitting
    fetchListings(); // Refresh the listings
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/listing/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Listing deleted successfully!");
      fetchListings(); // Refresh the listings after deletion
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Error deleting listing. Please try again.");
    }
  };

  useEffect(() => {
    fetchListings(); // Fetch listings when component mounts
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* Dashboard Navigation */}
      <DashboardNavigation setActiveSection={setActiveSection} />

      {/* Conditional Rendering Based on Active Section */}
      {activeSection === "products" && (
        <>
        
          <div className="listing-container">
            
              {/* Add Product Button */}
              <button
                className="add-listing-button"
                onClick={handleAddProductClick}
              >
                + Add Product
              </button>

              {/* Form for Adding/Updating Product */}
              {showForm && (
                <div className="product-overlay" >
                <form onSubmit={handleFormSubmit} className="listing-form">
                  
                  <h2>Add New Product</h2>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    picture
                    <input
                      type="file" // Change type to "file"
                      name="picture"
                      accept="image/*" // Restrict to image files
                      onChange={handleInputChange} // Use a separate handler for file input
                      required
                    />
                  </label>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Type:
                    <select
                      name="type"
                      value={newProduct.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Grocery">Grocery</option>
                    </select>
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button type="submit" className="submit-button1">
                    Create Listing
                  </button>
                  <button
                    type="button"
                    className="cancel-button23"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  
                </form>
                </div>
              )}

            {/* Product Listings */}
            <h2 className="Title2">Products</h2>
            <div className="card-container">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div className="card" key={listing._id}>
                    <h4>{listing.name}</h4>
                    <img
                      src={listing.picture ? `http://localhost:5000/${listing.picture}` : "https://via.placeholder.com/150"}
                      alt={listing.name || "Product"}
                    />
                    <p>
                      <strong>Quantity:</strong> {listing.quantity}
                    </p>
                    <p>
                      <strong>Type:</strong> {listing.type}
                    </p>
                    <p>
                      <strong>Price:</strong> ₱{listing.price}
                    </p>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(listing._id, listing)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(listing._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p>No listings available</p>
              )}
            </div>
          </div>

          {/* Modal for updating listings */}
          <Modal
            showModal={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleModalSubmit}
            product={newProduct}
            handleInputChange={handleInputChange}
          />
        </>
      )}

      {activeSection === "packages" && <Packages />}
      {activeSection === "orders" && <Orders />}
    </div>
  );
};

export default Dashboard;
