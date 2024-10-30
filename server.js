  const express = require("express");
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const bodyParser = require("body-parser");
  const User = require("./src/models/User"); // Adjust this path based on your file structure
  const app = express();

  const PORT = process.env.PORT || 5000;
  const JWT_SECRET = "your_jwt_secret"; // Replace with your own secret

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  const cors = require("cors"); // Add this line at the top
  app.use(cors()); // Enable CORS for all routes
  
  // Connect to MongoDB with error handling
  mongoose.connect("mongodb://localhost:27017/NMPC", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));
  // Register User
  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  });
  

  // Login User
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
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
  });const Listing = require("./src/models/Listing");

  // Fetch all listings
  app.get("/listing", authenticateJWT, async (req, res) => {
    try {
      const listings = await Listing.find(); // Fetch all listings from the database
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Error fetching listings" });
    }
  });
  
  // Create a new listing
  app.post("/listing/create", authenticateJWT, async (req, res) => {
    try {
      const { name, quantity, type, price } = req.body;
  
      const listing = new Listing({
        name,
        quantity,
        type,
        price
      });
  
      await listing.save();
      res.status(201).json({ message: "Listing created successfully" });
    } catch (error) {
      console.error("Error saving listing:", error);
      res.status(500).json({ error: "Error creating listing" });
    }
  });
  
  // Update a listing// Update a listing
app.put("/listing/update/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, quantity, type, price } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { name, quantity, type, price },
      { new: true, runValidators: true }
    );
    if (!updatedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ error: "Error updating listing" });
  }
});

  
  // Delete a listing
  app.delete("/listing/delete/:id", authenticateJWT, async (req, res) => {
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
  

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
