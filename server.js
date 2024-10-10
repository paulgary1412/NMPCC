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
  
  
  const hashedPassword = await bcrypt.hash(password, 10);

  
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send('User created!');
  } catch (error) {
    res.status(500).send('Error creating user!');
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
