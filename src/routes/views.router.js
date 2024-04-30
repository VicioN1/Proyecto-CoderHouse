const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../services/ProductManager.js");

const manager = new ProductManager(
  path.join(__dirname, "../data/Products.json")
);

router.get("/", (req, res) => {
  manager
    .getProducts()
    .then((productos) => {
      res.render("index", { productos });
    })
    .catch((error) => ({ message: error }));
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});

module.exports = router;
