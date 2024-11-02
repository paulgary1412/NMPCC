const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,

    quantity: {
      type: Number,
      required: true,
    },  },
  
  type: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
/**
 *    <strong>Quantity:</strong> {listing.quantity}
                    </p>
                    <p>
                      <strong>Type:</strong> {listing.type}
                    </p>
                    <p>
                      <strong>Price:</strong> ${listing.price}
 */