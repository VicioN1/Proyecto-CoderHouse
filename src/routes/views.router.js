const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../dao/db/ProductManager.DB");
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

const manager = new ProductManager();
// const manager = new ProductManager(
//   path.join(__dirname, "../data/Products.json")
// );

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

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get('/carts/:userId', (req, res) => {
  const userId = req.params.userId;

  console.log(userId)
  
  // Renderiza la plantilla Handlebars y pasa el userId
  res.render('carts', { userId });
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.session.user });
});

module.exports = router;
