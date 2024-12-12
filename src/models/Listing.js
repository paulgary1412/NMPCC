const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {  // Add the imageUrl field to store the Firebase URL
    type: String,
  },
  description: {  // Add the imageUrl field to store the Firebase URL
    type: String,
    required:true,
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
