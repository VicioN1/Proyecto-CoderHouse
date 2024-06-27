// managers/CartsManager.js
const UserModel = require("../../models/user.model")
const CartsManager = require("./CartsManager.DB")

const manager = new CartsManager();

class UserManager {
  constructor() {
    this.User = {};
  }

  async addUser(first_name, last_name, email, age, password) {
    try {
      const carrito = await manager.addCarts();
      const idcarrito = await manager.getCartsById(carrito);
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password,
        carts : [{
          cart_id: idcarrito.id,
          cart: idcarrito._id
        }],
        role: "user",
      });
      await newUser.save();
      return true + newUser;
    } catch (error) {
      return "Error al agregar Usuario: " + error.message;
    }
  }



  async getUserById(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return null;
    }
  }
  async getCartsById(userId) {
    try {
      const Cart = await UserModel.findOne({ _id: userId }).populate("carts.cart");
  
      if (!Cart) {
        throw new Error('Usuario no encontrado');
      }
      const primertCart = Cart.carts[0];
  
      console.log(primertCart);
      return primertCart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return null;
    }
  }
}

module.exports = UserManager;
