const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Usermanager = require("../dao/db/UserManager.DB");

const router = express.Router();
const manager = new Usermanager();
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const newUser = await manager
      .addUser(first_name, last_name, email, age, password)
      .then((newUser) => res.redirect("/login"))
      .catch((error) => console.error(error));
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al registrar usuario");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await manager.getUserById(email)
    console.log("user 1 "+ user)
    if (!user) return res.status(404).send("Usuario no encontrado");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Contraseña incorrecta");

    const carts = await manager.getCartsById(user._id);
    console.log(carts);

    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: carts.cart_id,
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

    const user = req.user
    console.log("user "+ user);

    const carts = await manager.getCartsById(user._id);
    console.log(carts);

    req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: carts.cart_id,
      role: user.role,
    };
    res.redirect("/realtimeproducts");
  }
);

module.exports = router;
