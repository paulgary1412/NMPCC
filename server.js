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
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_jwt_secret"; // Replace with your own secret

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
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
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword , usertype: 'member'});

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
    // Hardcoded JWT secret key
    const JWT_SECRET = 'your_secret_key_here'; // Static secret key
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, usertype: user.usertype }, JWT_SECRET);
  

    // Send the token back to the client
 
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
app.get("/listing", authenticateJWT, async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

// Create a new listing
app.post("/listing/create", authenticateJWT, upload.single("picture"), async (req, res) => {
  try {
    const { name, quantity, type, price } = req.body;
    const picture = req.file ? `uploads/${req.file.filename}` : null; // Save the image file path

    const listing = new Listing({
      name,
      picture,
      quantity,
      type,
      price,
    });

    await listing.save();
    res.status(201).json({ message: "Listing created successfully" });
  } catch (error) {
    console.error("Error saving listing:", error);
    res.status(500).json({ error: "Error creating listing" });
  }
});

// Update a listing
app.put("/listing/update/:id", authenticateJWT,upload.single("picture"), async (req, res) => {
  const { id } = req.params;
  const { name, quantity, type, price } = req.body;
  let updateData = { name, quantity, type, price };

  // Check if there's a new picture and update it
  if (req.file) {
  // If there's a new file, update the picture field
  updateData.picture = `uploads/${req.file.filename}`;
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

// Fetch all packages
// Fetch all packages with populated productId details
app.get("/package", authenticateJWT, async (req, res) => {
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
app.post("/package/create", authenticateJWT, async (req, res) => {
  const { name, price, items } = req.body;

  try {
    const newPackage = new Package({ name, price, items });
    await newPackage.save();
    res.status(201).json({ message: "Package created successfully" });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ error: "Error creating package" });
  }
});
// Update a package
app.put("/package/update/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, price, items } = req.body;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { name, price, items },
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
app.delete("/package/:id", authenticateJWT, async (req, res) => {
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


// Define Schema
const checkoutSchema = new mongoose.Schema({
  contactInfo: {
    name: String,
    email: String,
    phone: String,
  },
  selectedProducts: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  deliveryMethod: String,
  paymentMethod: String,
  totalAmount: Number,
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

// API Route to Save Data
app.post("/checkout", async (req, res) => {
  try {
    const checkoutData = new Checkout(req.body);
    await checkoutData.save();
    res.status(201).send({ message: "Checkout data saved successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save data" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
