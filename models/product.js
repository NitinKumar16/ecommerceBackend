const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true,'Please provide a valid name to the product'],
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: [true,'Please provide a valid description to the product'],
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: [true,'Please provide a valid price to the product and make sure its a number'],
      maxlength: 32,
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: "Category", //from where is this child schema is being inherited
      required: [true,'Please provide a valid categoryID to the product'],
    },
    stock: {
      type: Number,
      required: [true,'Please provide a valid stock value to the product, and make sure its a number'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      name: String,
      directory: String,
      contentType: String,
    },
    size: {
      type: String,
      required: [true,'Please provide a valid size the product'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
