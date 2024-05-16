const fs = require("fs").promises;

class CartsManager {
  constructor(path) {
    this.products = {};
    this.countId = 1;
    this.path = path;
  }

  async addCarts() {
    try {
      let cartsObj = await this.readCarts();
      let mayorId = 0;
      cartsObj.forEach((elemento) => {
        if (elemento.id > mayorId) {
          mayorId = elemento.id;
        }
      });

      let idCarts = mayorId + 1;

      const newCarts = {
        id: idCarts,
        products: [],
      };

      cartsObj.push(newCarts);
      await fs.writeFile(this.path, JSON.stringify(cartsObj, null, 2));
      return "Carrito creado con Exitó";
    } catch (error) {
      return "Error al agregar producto", error;
    }
  }

  async getCartsById(cart_id) {
    try {
      let cart = await this.readCarts();

      const id_encontrado = cart.find((elemento) => elemento.id === cart_id);
      return id_encontrado;
    } catch (error) {
      console.error("Error al consultar producto", error);
      return [];
    }
  }

  async readCarts() {
    try {
      const datos = await fs.readFile(this.path, "utf8");
      return JSON.parse(datos);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        throw error;
      }
    }
  }

  async updateProduct(cart_id, product_id) {
    try {
      const CartUpdate = await this.getCartsById(cart_id);
      let cartsObj = await this.readCarts();
      console.log("cart---------", CartUpdate);
      if (!CartUpdate) {
        console.log("falsee");
        return "id de carrito no encontrado";
      }
      const productList = CartUpdate.products;

      const posicion = cartsObj.findIndex(
        (elemento) => elemento.id === cart_id
      );

      const index = productList.findIndex(
        (item) => item.product === product_id
      );
      if (index !== -1) {
        productList[index].quantity += 1;
      } else {
        console.log("id producot no encontrado en carrito");
        const newproduct = {
          product : product_id,
          quantity: 1
        }
        productList.push(newproduct)
      }

      if (posicion != -1) {
        cartsObj[posicion] = CartUpdate;
      }

      await fs.writeFile(this.path, JSON.stringify(cartsObj, null, 2));
      return "Exitó"
    } catch (error) {
      console.error("Error al ejecutar la operacion", error);
    }
  }

}



module.exports = CartsManager;
