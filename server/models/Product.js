const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true }, // stored in ₹
    image: { type: String, default: '' },    // image URL
    category: { type: String, default: 'General' },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
