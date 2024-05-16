const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.products = {};
    this.countId = 1;
    this.path = path;
  }

  async addProduct(title, description, code, price, stock, category, thumbnails) {
    try {
      let productsObj = await this.readProducts();
      let mayorId = 0;
      productsObj.forEach((elemento) => {
        if (elemento.idProduct > mayorId) {
          mayorId = elemento.idProduct;
        }
      });

      let idProduct = mayorId + 1;

      const Producto_encontrado = Object.values(productsObj).find(
        (elemento) => elemento.code === code
      );
      if (Producto_encontrado) {
        return (`Ya existe un producto con este codigo: ${code}`);
      }
      const newProduct = {
        idProduct,
        title,
        description,
        code,
        price,
        status : true,
        stock,
        category,
        thumbnails : thumbnails || []
      };

      productsObj.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(productsObj, null, 2));
      return ("Producto agregado exitosamente");
    } catch (error) {
      return ("Error al agregar producto", error);
    }
  }

  async getProductById(product_id) {
    try {
      let producto = await this.readProducts();

      const id_encontrado = producto.find(
        (elemento) => elemento.idProduct === product_id
      );
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
        return productos.slice(0, limite);
      } else {
        return productos;
      }
    } catch (error) {
      console.error("Error al consultar usuarios", error);
      return [];
    }
  }

  async readProducts() {
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

  async updateProduct(product_id, camp, newvalue) {
    try {
      const ProductUpdate = await this.getProductById(product_id);
      let productsObj = await this.readProducts();
      if (Object.keys(ProductUpdate).includes(camp)) {
        ProductUpdate[camp] = newvalue;
        console.log(`Informacin actualizada correctamente: `,camp," = ", newvalue);
        const posicion = productsObj.findIndex(
          (elemento) => elemento.idProduct === product_id
        );
        if (posicion != -1) {
          productsObj[posicion] = ProductUpdate;
        }
        await fs.writeFile(this.path, JSON.stringify(productsObj, null, 2));
      } else {
        console.error("El campo especificado no existe en el objeto");
      }
    } catch (error) {
      console.error("Error al ejecutar la operacion", error);
    }
  }

  async deleteProduct(product_id) {
    try {
      console.log(product_id)
      let productsObj = await this.readProducts();
      productsObj = productsObj.filter(
        (elemento) => elemento.idProduct !== product_id
      );
      await fs.writeFile(this.path, JSON.stringify(productsObj, null, 2));
      return("Producto eliminado");
    } catch (error) {
      return("Error al ejecutar la operacion deleteProduct", error);
    }
  }

}

module.exports = ProductManager;
