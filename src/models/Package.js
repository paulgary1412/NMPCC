const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Package", PackageSchema);