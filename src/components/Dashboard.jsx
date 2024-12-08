import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage } from "../firebase"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import "../assets/Dashboard.css"; // Import the CSS file
import DashboardNavigation from "./DashboardNavigation"; // Import the DashboardNavigation component
import Packages from "./Packages"; // Import the Packages component
import AdminOrders from "./AdminOrders"; // Import the Orders component

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("products"); // Track the active section
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    type: "",
    price: "",
    imageUrl: "", // To store the image URL from Firebase
    description:"",
  });
  const [listings, setListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);

  const handleAddProductClick = () => {
    setShowForm(true);
    setNewProduct({ name: "", quantity: "", type: "", price: "", imageUrl: "" ,description:""});
    setEditingListingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Upload the file
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          // Once upload is complete, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewProduct((prevProduct) => ({
              ...prevProduct,
              imageUrl: downloadURL, // Store the URL of the uploaded image
            }));
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit the form.");
      return;
    }

    // Decode the token (assuming it's a JWT)
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token if it's a JWT
      const userType = decodedToken.usertype; // Replace with the correct field name if it's different

      if (userType !== 'admin') {
        alert("You do not have permission to submit this form.");
        return;
      }

      if (editingListingId) {
        // Update existing listing
        try {
          await axios.put(
            `http://localhost:5000/listing/update/${editingListingId}`,
            newProduct,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
            newProduct,  // Include imageUrl in the payload
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("Listing created successfully!");
        } catch (error) {
          console.error("Error creating listing:", error);
          alert("Error creating listing. Please try again.");
        }
      }

      setNewProduct({ name: "", quantity: "", type: "", price: "", imageUrl: "",description:"" });
      setShowForm(false);
      fetchListings(); // Refresh the listings

    } catch (error) {
      console.error("Error decoding token:", error);
      alert("Invalid token or user type.");
    }
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
    setShowForm(true);
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
      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Error deleting listing. Please try again.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardNavigation setActiveSection={setActiveSection} />
      
      {activeSection === "products" && (
        <>
          <div className="listing-container">
            <h2 className="Title1">Pric</h2>
            <button className="add-listing-button" onClick={handleAddProductClick}>
              + Add Product
            </button>

            {showForm && (
              <div className="formcontainer">
              <form onSubmit={handleFormSubmit} className="listing-form2">
                <h2>{editingListingId ? "Update Product" : "Add New Product"}</h2>
                <label>
                 <b> Name:</b>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                    className="something"
                  />
                </label>
                <label>
                <b> Quantity:</b>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                <b> Type:</b>
                  <select
                    name="type"
                    value={newProduct.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Grocery">Grocery</option>
                  </select>
                </label>
                <label>
                <b> Price:</b>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                <b> Product Image:</b>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <label>
                <b> Description:</b>
                  <textarea
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <button type="submit" className="submit-button1">
                  {editingListingId ? "Update Listing" : "Create Listing"}
                </button>
                <button type="button" className="cancel-button23" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </form>
              </div>
            )}

            <h2>Products</h2>
            <div className="card-container">
              {listings.length > 0 ? (
                listings.map((listing) => (

                  <div className="card" key={listing._id}>
                    <div className="card-details">
                    <h4>{listing.name}</h4>
                    
                    <img src={listing.imageUrl || "default-image-url"} alt="Product" />
                    <p><strong>Quantity:</strong> {listing.quantity}</p>
                    <p><strong>Type:</strong> {listing.type}</p>
                    <p><strong>Price:</strong> ₱{listing.price}</p>
                    <div className="button-group2">
            </div>
          
                    <button className="update-button" onClick={() => handleUpdate(listing._id, listing)}>
                  Update
                  
                </button>
                  
                  <button className="delete-button" onClick={() => handleDelete(listing._id)}>
                  Delete
                </button>
                
                </div>
                </div>
                ))
              ) : (
                <p>No listings available</p>
              )}
              
            </div>
            
          </div>
        </>
      )}

      {activeSection === "packages" && <Packages />}
      {activeSection === "AdminOrders" && <AdminOrders />}
    </div>
  );
};

export default Dashboard;
