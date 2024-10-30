const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./src/models/User');

const app = express();


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/NMPC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username is already taken!' });
      }
  
      // Check if the email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email is already registered!' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully!' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user!' });
    }
  });
  


app.listen(5000, () => console.log("Server running on port 5000"));
