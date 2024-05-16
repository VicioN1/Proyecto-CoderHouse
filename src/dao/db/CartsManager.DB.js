const cartsModel = require("../models/carts.model");

class CartsManager {
  constructor() {
    this.products = {};
    this.countId = 1;
  }

  async addCarts() {
    try {
      const lastProduct = await cartsModel.findOne().sort({ id: -1 });
      const nextId = (lastProduct && lastProduct.id + 1) || 1;

      const newCarts = await cartsModel.create({
        id: nextId,
        products: [],
      });
      return "Carrito creado con Exitó";
    } catch (error) {
      return "Error al agregar producto", error;
    }
  }

  async getCartsById(cart_id) {
    try {
      let cart = await cartsModel.findOne({id : cart_id})
      if (!cart) {
        return cart;
      }
      return cart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return [];
    }
  }

  async readCarts() {
    try {
      const datos = await cartsModel.find();
      return datos;
    } catch (error) {
      return (error)
    }
  }

  async updateProduct(cartId, productId) {
    try {
      productId = String(productId);
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        return "ID de carrito no encontrado";
      }
      const product = cart.products.find(item => item.product === productId);

      console.log(product)
      if (product) {
      product.quantity += 1;
      } else {
      cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
  
      return cart;
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error; // Puedes manejar este error según tus necesidades
    }
  }

}



module.exports = CartsManager;
