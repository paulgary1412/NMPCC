const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => uuidv4(),  // Automatically generate a unique ID using UUID
  },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, default: 'member' }, // Default to 'member'
});

module.exports = mongoose.model("User", userSchema);
