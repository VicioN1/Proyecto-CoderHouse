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
  const cart_id = req.params.cid;
  let product;
  manager
    .getCartsById(cart_id)
    .then((cart) => {
      const products = !cart ? "Not found" : (product = cart.products);
      res.json({ products });
    })
    .catch((error) => res.status(404).json({ message: error }));
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart_id = req.params.cid;
    const product_id = req.params.pid;

    const updatedCart = await manager.updateProduct(cart_id, product_id);
    res.json({ message: updatedCart });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await manager.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const result = await manager.updateCart(req.params.cid, req.body.products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await manager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const result = await manager.deleteAllProductsFromCart(req.params.cid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
