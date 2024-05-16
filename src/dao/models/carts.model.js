const mongoose = require("mongoose");

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  id: String,
  products: [{
    product: String,
    quantity: Number
  }]
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartsModel;
