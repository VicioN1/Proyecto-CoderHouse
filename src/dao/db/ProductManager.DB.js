const productsModel = require("../models/products.model");

class ProductManager {
  constructor() {
    this.products = {};
    this.countId = 1;
  }

  async addProduct(title, description, code, price, stock, category, thumbnails) {
    try {
      const lastProduct = await productsModel.findOne().sort({ idProduct: -1 });
      const nextId = (lastProduct && lastProduct.idProduct + 1) || 1;

      const existingProduct = await productsModel.findOne({ code });
        if (existingProduct) {
          return `Ya existe un producto con este código: ${code}`;
        }

      const newProduct = await productsModel.create({
        idProduct : nextId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
      });
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar producto", error);
      return "Error al agregar producto";
    }
  }

  async getProductById(product_id) {
    try {
      const id_encontrado = await productsModel.findOne({ idProduct: product_id})
      if (!id_encontrado) {
        return "Not found";
      }
      return id_encontrado;
    } catch (error) {
      console.error("Error al consultar producto", error);
      return [];
    }
  }

  async getProducts(limite) {
    try {
      const productos = await this.readProducts();
      if (limite) {
        const products = await productsModel.find().limit(limite);
        return products;
      } else {
        const products = await productsModel.find();
        return products;
      }
    } catch (error) {
      console.error("Error al consultar usuarios", error);
      return [];
    }
  }

  async readProducts() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos", error);
      return [];
    }
  }

  async updateProduct(product_id, camp, newvalue) {
    try {
      const existeProduct = await productsModel.findOne().sort({ idProduct: product_id})
      if (!existeProduct) {
        return "Producto no encontrado";
      }

      const validFields = Object.keys(existeProduct.schema.paths);
      if (!validFields.includes(camp)) {
          return "El campo especificado no existe en el producto";
      }

      existeProduct[camp] = newvalue;
      await existeProduct.save();

      return "Producto actualizado exitosamente";
    } catch (error) {
      console.error("Error al ejecutar la operacion", error);
    }
  }

  async deleteProduct(product_id) {
    try {
      const existeProduct = await productsModel.findOne({ idProduct: product_id})
      if (!existeProduct) {
        return "Producto no encontrado";
      }
      const deleteProduct = await productsModel.findByIdAndDelete(existeProduct._id);
      return "Producto eliminado exitosamente";
    } catch (error) {
      console.log("Error al ejecutar la operacion deleteProduct", error)
      return("Error al ejecutar la operacion deleteProduct", error);
    }
  }

}

module.exports = ProductManager;
