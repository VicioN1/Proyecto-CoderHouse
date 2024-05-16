const mongoose = require("mongoose");

const productsCollection = "Productos";

const productsSchema = new mongoose.Schema({
    idProduct : { type: Number, required: true },
    title : { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 200 },
    code : { type: String, required: true },
    price : { type: Number, required: true },
    status : { type: Boolean, required: true },
    stock : { type: Number, required: true },
    category : { type: String, required: true, max: 100 },
    thumbnails : { type: Object, default : [] }
});

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = productsModel;
