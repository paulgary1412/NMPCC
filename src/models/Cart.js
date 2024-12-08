const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model for authentication
    required: true,
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming products are stored in a Product model
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
