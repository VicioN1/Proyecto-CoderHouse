const express = require("express");
const router = express.Router();
const path = require("path");
const CartsManager = require("../dao/db/CartsManager.DB");
const ProductManager = require("../dao/db/ProductManager.DB");

const manager = new CartsManager();
const managerProducts = new ProductManager();

router.post("/", (req, res) => {
  manager
    .addCarts()
    .then((message) => res.json({ message: message }))
    .catch((error) => res.status(404).json({ message: error }));
});

router.get("/:cid", (req, res) => {
  const cart_id = parseInt(req.params.cid);
  let product;
  manager
    .getCartsById(cart_id)
    .then((cart) => {
      const products = !cart ? "Not found" : (product = cart.products);
      res.json({ products });
    })
    .catch((error) => res.status(404).json({ message: error }));
});

router.post("/:cid/product/:pid", (req, res) => {
  try {
    const cart_id = parseInt(req.params.cid);
    const product_id = parseInt(req.params.pid);

    managerProducts
      .getProductById(product_id)
      .then((message) =>{
        if (message != "Not found") {
            manager
              .updateProduct(cart_id, product_id)
              .then((producto) => res.json({ message: producto }))
              .catch((error) => res.status(404).json({ message: error }));
          }else{
            res.json({ message: "El producto no existe" })
          }
        })
      .catch((error) => res.status(404).json({ message: error }));
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
