const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  purity: { type: String, required: true }, // e.g., "99.5% PURE"
  category: { 
    type: String, 
    required: true, 
    enum: ['Nhiên liệu', 'Dược phẩm', 'Thực phẩm'] 
  },
  badge: { type: String }, // e.g., "Bán chạy nhất", "Cao cấp"
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
