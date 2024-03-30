const fs = require("fs").promises;

class ProductManager {
  constructor() {
    this.products = {};
    this.countId = 1;
    this.path = "Products.json";
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      let productsObj = await this.readProducts();
      let mayorId = 0;
      // busca un numero id
      productsObj.forEach((elemento) => {
        if (elemento.idProduct > mayorId) {
            mayorId = elemento.idProduct
        }
      });

     let idProduct = mayorId + 1

      const Producto_encontrado = Object.values(productsObj).find(
        (elemento) => elemento.code === code
      );
      // console.log(Producto_encontrado)
      if (Producto_encontrado) {
        console.log(`Ya existe un producto con este codigo: ${code}`);
        return;
      }

      const NewProducts = {
        idProduct,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      productsObj.push(NewProducts);
      await fs.writeFile(this.path, JSON.stringify(productsObj, null, 2));
      console.log("Producto agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar producto", error);
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
      // // console.log("El Producto con el ID proporcionado existe");
      // this.products.forEach((elemento) => {
      //   if (elemento.idProduct == product_id) {
      //     // console.log("entre")
      //     producto = elemento;
      //   }
      // });
      return id_encontrado;
    } catch (error) {
      console.error("Error al consultar usuarios", error);
      return [];
    }
  }

  async getProducts() {
    try {
      return await this.readProducts();
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
        console.log(`Informacin actualizada correctamente`);
        //busco la posicion 
        const posicion = productsObj.findIndex(
          (elemento) => elemento.idProduct === product_id
        )
        // console.log(posicion)
        if (posicion != -1) {
          productsObj[posicion] = ProductUpdate;
        }
        // console.log(ProductUpdate)
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
        let productsObj = await this.readProducts();
        productsObj = productsObj.filter(elemento => elemento.idProduct !== product_id);
        console.log("Producto eliminado");
        await fs.writeFile(this.path, JSON.stringify(productsObj, null, 2));
    } catch (error) {
        console.error("Error al ejecutar la operacion deleteProduct", error);
    }
}
}

const productmanager = new ProductManager();

// productmanager.addProduct(
//   "producto prueba",
//   "Este es un producto prueba",
//   200,
//   "Sin imagen",
//   "abc12",
//   25
// );

// productmanager
//   .getProducts()
//   .then((producto) => console.log(producto))
//   .catch((error) => console.error(error));

// productmanager
//   .getProductById(1)
//   .then((producto) => console.log(producto))
//   .catch((error) => console.error(error));

// productmanager.updateProduct(4, "title", "prueba-------------");

// productmanager.deleteProduct(2);
