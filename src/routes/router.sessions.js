const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const passport = require("passport");
const CartsManager = require("../dao/db/CartsManager.DB");

const router = express.Router();
const manager = new CartsManager();
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  let id
  try {
    const carrito = await manager.addCarts();
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      cart : carrito,
      role: "user",
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error al registrar usuario");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Contraseña incorrecta");

    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart : user.cart,
      role: user.role,
    };
    res.redirect("/realtimeproducts");
  } catch (err) {
    res.status(500).send("Error al iniciar sesión");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/realtimeproducts");
  }
);

module.exports = router;
