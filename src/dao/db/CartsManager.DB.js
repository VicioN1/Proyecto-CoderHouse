// managers/CartsManager.js
const cartsModel = require("../../models/carts.model");
const ProductManager = require("../db/ProductManager.DB");

const managerProducts = new ProductManager();

class CartsManager {
  constructor() {
    this.products = {};
    this.countId = 1;
  }

  async addCarts() {
    try {
      const lastCart = await cartsModel.findOne().sort({ id: -1 });
      const nextId = (lastCart && parseInt(lastCart.id) + 1) || 1;

      const newCart = await cartsModel.create({
        id: String(nextId),
        products: [],
      });
      return String(nextId);
    } catch (error) {
      return "Error al agregar producto: " + error.message;
    }
  }

  async getCartsById(cart_id) {
    try {
      const cart = await cartsModel
        .findOne({ id: cart_id })
        .populate("products.product");

      return cart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return null;
    }
  }

  async readCarts() {
    try {
      const datos = await cartsModel.find().populate("products.product");
      return datos;
    } catch (error) {
      return error;
    }
  }

  async updateProduct(cartId, productId) {
    try {
      const serchId = await managerProducts.getProductById(productId);
      if(!serchId){
        return "El producto no existe"
      }
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        return "ID de carrito no encontrado";
      }

      const product = cart.products.find((item) =>
        item.product.equals(serchId._id)
      );

      if (product) {
        product.quantity += 1;
      } else {
        cart.products.push({
          product_id: serchId.idProduct,
          product: serchId._id,
          quantity: 1,
        });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        return "ID de carrito no encontrado";
      }
      cart.products = cart.products.filter(
        (item) => item.product_id != productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { id: cartId },
        { products },
        { new: true }
      );
      if (!cart) {
        return "ID de carrito no encontrado";
      }
      return cart;
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        return "ID de carrito no encontrado";
      }
      const product = cart.products.find(
        (item) => item.product_id.toString() === productId
      );
      if (product) {
        product.quantity = parceInt(quantity);
        await cart.save();
        return cart;
      } else {
        return "Producto no encontrado en el carrito";
      }
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        return "ID de carrito no encontrado";
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al ejecutar la operación", error);
      throw error;
    }
  }
}

module.exports = CartsManager;
