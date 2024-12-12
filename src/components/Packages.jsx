import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage } from "../firebase"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import storage functions
import "../components/css/Package.css"; // Import the CSS file

const Packages = () => {
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [newPackageName, setNewPackageName] = useState("");
  const [packageQuantity, setPackageQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState(""); // New state for description
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchPackages();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/listing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/package", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  // Sum of all products in package
  const calculateTotal = () => {
    let total = 0;
    selectedProducts.forEach((product) => {
      const productData = products.find((item) => item._id === product.productId);
      if (productData) {
        total += productData.price * product.quantity;
      }
    });
    return total - discount;
  };

  const handleAddProduct = () => {
    const exists = selectedProducts.find((item) => item.productId === selectedProductId);
    const productData = products.find((item) => item._id === selectedProductId);
  
    if (productData) {
      if (exists) {
        setSelectedProducts((prev) =>
          prev.map((item) =>
            item.productId === selectedProductId
              ? { ...item, quantity }
              : item
          )
        );
      } else {
        setSelectedProducts((prev) => [
          ...prev,
          {
            productId: selectedProductId,
            quantity,
            name: productData.name,  // Add product name here
            price: productData.price, // Add product price here
          },
        ]);
      }
    }
  
    setSelectedProductId("");
    setQuantity(1);
  };
  
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleAddPackageClick = () => {
    setShowPackageForm(true);
    setEditingPackage(null); // Reset editingPackage when creating a new package
  };

  const handleCancel = () => {
    setShowPackageForm(false);
    resetFormFields();
  };

  const resetFormFields = () => {
    setNewPackageName("");
    setSelectedProducts([]);
    setDiscount(0);
    setDescription("");
    setImageUrl("");
    setPackageQuantity(1);
    setEditingPackage(null);
  };
  const handlePackageFormSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit the form.");
      return;
    }
  
    const items = selectedProducts.map((item) => ({
      productId: item.productId,
      name: item.name,     // Include name
      price: item.price,   // Include price
      quantity: item.quantity,
    }));
  
    try {
      const packageData = {
        name: newPackageName,
        price: calculateTotal(),
        items,
        quantity: packageQuantity,
        description,
        imageUrl,
      };
  
      if (editingPackage) {
        await axios.put(`http://localhost:5000/package/update/${editingPackage._id}`, packageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Package updated successfully!");
      } else {
        await axios.post("http://localhost:5000/package/create", packageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Package created successfully!");
      }
  
      handleCancel();
      fetchPackages();
    } catch (error) {
      console.error("Error creating/updating package:", error);
      alert("Error creating/updating package. Please try again.");
    }
  };
  

  const handleUpdatePackage = (pkg) => {
    setEditingPackage(pkg);
    setNewPackageName(pkg.name);
    setDiscount(pkg.discount || 0);
    setPackageQuantity(pkg.quantity || 1);
    setDescription(pkg.description || "");
    setImageUrl(pkg.imageUrl || "");
    setSelectedProducts(pkg.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })));
    setShowPackageForm(true);
  };

  const handleDeletePackage = async (pkgId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/package/${pkgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Package deleted successfully!");
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `package_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  return (
    <div className="packages-container">
      <h2 className="Title1">Packages</h2>
      <button className="add-package-button" onClick={handleAddPackageClick}>
        + Add Package
      </button>

      {showPackageForm && (
  <div className="package-overlay">
    <form onSubmit={handlePackageFormSubmit} className="package-form">
      <h2>{editingPackage ? "Edit Package" : "Create New Package"}</h2>
      
      <div className="form-group">
        <label htmlFor="package-name">Package Name:</label>
        <input
          id="package-name"
          type="text"
          value={newPackageName}
          onChange={(e) => setNewPackageName(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="package-description">Package Description:</label>
        <textarea
          id="package-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="package-quantity">Package Quantity:</label>
        <input
          id="package-quantity"
          type="number"
          min="1"
          value={packageQuantity}
          onChange={(e) => setPackageQuantity(parseInt(e.target.value) || 1)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-select">Select Product:</label>
        <select
          id="product-select"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          required
          className="form-select"
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ₱{product.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="product-quantity">Quantity:</label>
        <input
          id="product-quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
          className="form-input"
        />
      </div>

      <button
        type="button"
        className="add-product-button"
        onClick={handleAddProduct}
        disabled={!selectedProductId}
      >
        Add Product
      </button>

      {/* Scrollable section for selected products */}
      <div className="selected-products-list">
        <h3>Selected Products</h3>
        <div className="scrollable-list">
          <ul>
            {selectedProducts.map((item) => (
              <li key={item.productId}>
                {products.find((p) => p._id === item.productId)?.name} - {item.quantity} pcs
                <button onClick={() => handleRemoveProduct(item.productId)} className="remove-button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="discount">Discount:</label>
        <input
          id="discount"
          type="number"
          min="0"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image-upload">Upload Image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-package-button">
          {editingPackage ? "Update Package" : "Create Package"}
        </button>
        <button type="button" className="cancel-package-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

  <h3>Existing Packages</h3>
  <div className="packages-list">
  {packages.map((pkg) => (
    <div key={pkg._id} className="package-item">
      <h4>{pkg.name}</h4>
      <div className="image-container2">
        <img src={pkg.imageUrl || "default-image-url"} alt="Package" />
      </div>
    
      <h5>Price: ₱{pkg.price.toFixed(2)}</h5>
      <p>Quantity: {pkg.quantity}</p>
   
      {/* Display the products inside the package */}
      <div className="package-products">
        <h5>Products Included in This Package:</h5>
        <ul>
          {pkg.items.map((item) => {
            const productData = products.find((product) => product._id === item.productId);
            return (
              <li key={item.productId}>
                {productData ? (
                  <>
                    {productData.name} - {item.quantity} pcs
                  </>
                ) : (
                  "Product not found"
                )}
              </li>
            );
          })}
        </ul>

        <button className="edit" onClick={() => handleUpdatePackage(pkg)}>
          Edit
        </button>
        <button className="del" onClick={() => handleDeletePackage(pkg._id)}>
          Delete
        </button>
      </div>

   
        
    </div>
  ))}
</div>

    </div>
  );
};

export default Packages;
