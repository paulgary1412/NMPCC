  const express = require("express");
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const User = require("./src/models/User"); // Adjust this path based on your file structure
  const Listing = require("./src/models/Listing");
  const Package = require("./src/models/Package");
  const multer = require("multer");

  const app = express();
  const PORT = 5000;
  const JWT_SECRET = "your_jwt_secret"; // Replace with your own secret

  // Middleware
  app.use(cors({ origin: '*' })); // Allow all origins for testing

  app.use(bodyParser.json());
  app.use(cors({ origin: "*" })); // Allow all origins for testing

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));

  // Connect to MongoDB without env variables
  mongoose
    .connect('mongodb+srv://quasi452:1412@cluster0.tv4qs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      console.log('Connected to MongoDB!');
    })
    .catch((err) => {
      console.log('MongoDB connection error: ', err);
    });

  // Middleware to verify JWT
  const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };


  // Set up storage for images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads"); // Directory where you want to save images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname); // Rename the file to avoid duplication
    },
  });

  const upload = multer({ storage: storage });

  // Register User

  const { v4: uuidv4 } = require("uuid");

  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a unique userId
      const userId = uuidv4();  // Make sure to generate userId here

      // Create a new user with the userId
      const user = new User({
        userId: userId,  // Include the userId here
        username,
        email,
        password: hashedPassword,
        usertype: "nonmember", // Default user type
        contact:"N/A",
        paymentMethod :"N/A",
        plan:"N/A"
      });

      // Save the new user to the database
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  });

  app.put("/update-usertype", async (req, res) => {
    const { email,contact,paymentMethod,plan } = req.body; // Use email instead of id

    try {
      const user = await User.findOne({ email }); // Find user by email
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.usertype = "member"; // Update usertype to 'member'
  
      user.contact = contact;
      user.paymentMethod = paymentMethod;
      user.plan = plan;

      await user.save();

      res.status(200).json({ message: "User type updated to member successfully" });
    } catch (error) {
      console.error("Error updating user type:", error);
      res.status(500).json({ error: "Error updating user type" });
    }
  });
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email, usertype: user.usertype },
        JWT_SECRET
      );
  
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
  

  // Fetch User Profile
  app.get("/user/profile", authenticateJWT, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching user data" });
    }
  });

  // Update User Profile
  app.put("/user/profile", authenticateJWT, async (req, res) => {
    const { username, email, password } = req.body;
    const updateData = { username, email };

    // Only hash the password if it's being changed
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    try {
      const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
      if (user) {
        res.json({ message: "Profile updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: "Error updating profile" });
    }
  });
  //display pharmacy products and packages
  // In your Express server code:
  app.get("/pharmacy", async (req, res) => {
    try {
      const products = await Listing.find();  // or the appropriate collection/model
      const packages = await Package.find();  // or the appropriate collection/model
      res.json({ products, packages });
    } catch (error) {
      res.status(500).json({ message: "Error fetching data" });
    }
  });
  // Fetch all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await Package.find();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Error fetching packages" });
    }
  });

  // Fetch all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await Listing.find();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });


  // Fetch all listings
  app.get("/listing",  async (req, res) => {
    try {
      const listings = await Listing.find();
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Error fetching listings" });
    }
  });

  app.post("/listing/create", async (req, res) => {
    try {
      const { name, quantity, type, price, imageUrl ,description} = req.body; // Include imageUrl here

      const listing = new Listing({
        name,
        imageUrl,  // Save the Firebase URL
        quantity,
        type,
        price,
        description,
      });

      await listing.save();
      res.status(201).json({ message: "Listing created successfully" });
    } catch (error) {
      console.error("Error saving listing:", error);
      res.status(500).json({ error: "Error creating listing" });
    }
  });

  app.put("/listing/update/:id", upload.single("picture"), async (req, res) => {
    const { id } = req.params;
    const { name, quantity, type, price, imageUrl ,description} = req.body;

    // Prepare update data
    let updateData = { name, quantity, type, price,description };

    // If there's a new picture, update the imageUrl field with the uploaded image's URL
    if (req.file) {
      updateData.imageUrl = `uploads/${req.file.filename}`; // Update with the new image path
    } else if (imageUrl) {
      updateData.imageUrl = imageUrl; // If no new image but imageUrl exists in the request body, use it
    }

    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedListing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      res.json(updatedListing); // Return the updated listing
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ error: "Error updating listing" });
    }
  });

  // Delete a listing
  app.delete("/listing/delete/:id", async (req, res) => {
    try {
      const listing = await Listing.findByIdAndDelete(req.params.id);
      if (listing) {
        res.json({ message: "Listing deleted successfully" });
      } else {
        res.status(404).json({ error: "Listing not found" });
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ error: "Error deleting listing" });
    }
  });

  // Fetch all packages
  // Fetch all packages with populated productId details
  app.get("/package", async (req, res) => {
    
    try {
      const packages = await Package.find().populate({
        path: "items._id",
        select: "name price", // Only retrieve name and price from Listing
      });

      // Process packages to check for missing productId references
      const processedPackages = packages.map(pkg => {
        const processedItems = pkg.items.map(item => {
          if (!item.productId) {
            return {
              ...item._doc,
              name: "Product Not Found",
              price: "N/A",
            };
          }
          return item;
        });
        return { ...pkg._doc, items: processedItems };
      });

      res.json(processedPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Error fetching packages" });
    }
  });

  // Create a new package
  app.post("/package/create", async (req, res) => {
    const { name, price, items,quantity,imageUrl,description } = req.body;

    try {
      const newPackage = new Package({ name, price, quantity,items ,imageUrl,description});
      await newPackage.save();
      res.status(201).json({ message: "Package created successfully" });
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(500).json({ error: "Error creating package" });
    }

  });
  // Update a package
  app.put("/package/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price,quantity, items ,imageUrl,description} = req.body;

    try {
      const updatedPackage = await Package.findByIdAndUpdate(
        id,
        { name, price,quantity, imageUrl,description,items },
        { new: true, runValidators: true }
      );
      if (!updatedPackage) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(updatedPackage);
    } catch (error) {
      console.error("Error updating package:", error);
      res.status(500).json({ error: "Error updating package" });
    }
  });

  // Delete a package (already implemented as shown in your code)
  app.delete("/package/:id", async (req, res) => {
    try {
      const pkg = await Package.findByIdAndDelete(req.params.id);
      if (pkg) {
        res.json({ message: "Package deleted successfully" });
      } else {
        res.status(404).json({ error: "Package not found" });
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ error: "Error deleting package" });
    }
  });

  const checkoutSchema = new mongoose.Schema({
    user_idd: { type: String, required: true },
    contactInfo: { type: Object, required: true },
    selectedProducts: { type: Array, required: true },
    deliveryMethod: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    statusOrder: { type: String, default: 'Pending' }, // Default to 'member'
    statusInfo: { type: String, default: 'Pending' }, // Default to 'member'
    
  }, {
    timestamps: true , // This will automatically add createdAt and updatedAt fields
    

  });

  const Checkout = mongoose.model('Checkout', checkoutSchema);


  // POST route for handling checkout
  app.post("/checkout", async (req, res) => {
    try {
      // Log the incoming request body to verify if `user_idd` is included
      console.log(req.body); // Check if user_idd and other fields are in the body

      // Create a new Checkout document from the request body
      const checkoutData = new Checkout(req.body);

      // Save the checkout data to the database
      await checkoutData.save();

      // Send success response
      res.status(201).send({ message: "Checkout data saved successfully!" });
    } catch (error) {
      // Log the error and send a failure response
      console.error("Error saving checkout data:", error);
      res.status(500).send({ error: "Failed to save data" });
    }
  });
  app.get("/checkout/:user_idd", async (req, res) => {
    try {
      // Extract user_idd from the request parameters
      const { user_idd } = req.params;

      // Fetch checkout data associated with the provided user_idd
      const checkoutData = await Checkout.find({ user_idd });

      // Get the current date
      const currentDate = new Date().toISOString();

      // Check if data exists for the user
      if (!checkoutData.length) {
        return res.status(404).send({ message: "No checkout data found for this user", date: currentDate });
      }

      // Send the retrieved data along with the current date and the createdAt field
      res.status(200).send({
        message: "Checkout data retrieved successfully",
        data: checkoutData.map(item => ({
          ...item.toObject(),
          createdAt: item.createdAt  // Ensure createdAt is included in the response
        })),
        date: currentDate
      });
    } catch (error) {
      // Log the error and send a failure response
      console.error("Error retrieving checkout data:", error);
      res.status(500).send({ error: "Failed to retrieve data", date: new Date().toISOString() });
    }
  });

  app.get("/checkout", async (req, res) => {
    try {
      // Fetch all checkout data
      const checkoutData = await Checkout.find();

      // Get the current date
      const currentDate = new Date().toISOString();

      // Check if data exists
      if (!checkoutData.length) {
        return res.status(404).send({ message: "No checkout data found", date: currentDate });
      }

      // Send the retrieved data along with the current date and the createdAt field
      res.status(200).send({
        message: "Checkout data retrieved successfully",
        data: checkoutData.map(item => ({
          ...item.toObject(),
          createdAt: item.createdAt  // Ensure createdAt is included in the response
        })),
        date: currentDate
      });
    } catch (error) {
      // Log the error and send a failure response
      console.error("Error retrieving checkout data:", error);
      res.status(500).send({ error: "Failed to retrieve data", date: new Date().toISOString() });
    }
  });

  // PUT route for updating checkout status
  app.put("/checkout/update/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params; // Get the order ID from URL parameters
      const { statusOrder, statusInfo } = req.body; // Get the new status and info from the request body

      // Find and update the checkout data based on the provided orderId
      const updatedCheckout = await Checkout.findByIdAndUpdate(
        orderId, // Find the document by orderId
        { statusOrder, statusInfo }, // Update these fields
        { new: true } // Return the updated document
      );

      // If no document is found with the given orderId
      if (!updatedCheckout) {
        return res.status(404).send({ message: "Order not found" });
      }

      // Send success response
      res.status(200).send({
        message: "Order status updated successfully!",
        data: updatedCheckout,
      });
    } catch (error) {
      console.error("Error updating checkout data:", error);
      res.status(500).send({ error: "Failed to update data" });
    }
  });

  // DELETE route for deleting a checkout order
  app.delete("/checkout/delete/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params; // Get the order ID from the URL parameters

      // Find and delete the checkout data based on the provided orderId
      const deletedCheckout = await Checkout.findByIdAndDelete(orderId);

      // If no document is found with the given orderId
      if (!deletedCheckout) {
        return res.status(404).send({ message: "Order not found" });
      }

      // Send success response
      res.status(200).send({ message: "Order deleted successfully!" });
    } catch (error) {
      console.error("Error deleting checkout data:", error);
      res.status(500).send({ error: "Failed to delete data" });
    }
  });


  const cartSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Associate cart with a specific user
    items: [
      {
        product_id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true }, // Optional, can be calculated dynamically
    updatedAt: { type: Date, default: Date.now }
    
  });

  // Create the Cart model
  const Cart = mongoose.model("Cart", cartSchema);

  // API Endpoint to Add or Update Cart
  app.post("/cart", async (req, res) => {
    try {
      const { user_id, items } = req.body;

      if (!user_id || !items || items.length === 0) {
        return res.status(400).send({ message: "Invalid cart data" });
      }

      // Calculate the total price of the cart
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Find and update the cart for the user, or create a new one if it doesn't exist
      const cart = await Cart.findOneAndUpdate(
        { user_id },
        { items, total, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      res.status(200).send({ message: "Cart updated successfully", cart });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).send({ message: "Failed to update cart" });
    }
  });


  app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
  });
