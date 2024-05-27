const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../dao/db/ProductManager.DB");

const manager = new ProductManager();
// const manager = new ProductManager(
//   path.join(__dirname, "../data/Products.json")
// );

const miurl = `http://localhost:8080/api/products`;
router.get("/", (req, res) => {
  try {
  const { limit , page , sort, query, status } = req.query;


  manager
    .getProducts(limit , page , sort, query, status)
    .then((producto) => 
      res.json({
        status: 'success',
        payload: producto.docs,
        totalPages: producto.totalPages,
        prevPage: producto.prevPage,
        nextPage: producto.nextPage,
        page: producto.page,
        hasPrevPage: producto.hasPrevPage,
        hasNextPage: producto.hasNextPage,
        prevLink: producto.hasPrevPage ? `${miurl}?page=${producto.prevPage}&limit=${producto.limit}&${producto.params}` : null,
        nextLink: producto.hasNextPage ? `${miurl}?page=${producto.nextPage}&limit=${producto.limit}&${producto.params}` : null
        // nextLink: producto.hasNextPage ? `${miurl}?page=${producto.nextPage}&limit=${producto.limit}&sort=${sort}&query=${query}&status=${status}` : null
      })
    )
    .catch((error) => res.status(404).json({ message: error }));
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
  }
});

router.get("/:pid", (req, res) => {
  const product_id = parseInt(req.params.pid);
  manager
    .getProductById(product_id)
    .then((message) => res.json({ message: message }))
    .catch((error) => res.status(404).json({ message: error }));
});

router.post("/", (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
    req.body;
    console.log(title)

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // manager.addProduct(title, description, code, price, stock, category, thumbnails);

    manager
      .addProduct(title, description, code, price, stock, category, thumbnails)
      .then((producto) => res.json(producto))
      .catch((error) => res.status(404).json({ message: error }));
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/:pid", (req, res) => {
  const product_id = parseInt(req.params.pid);
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const newProduct = {
      title: title || null,
      description: description || null,
      code: code || null,
      price: price || null,
      status: status || null,
      stock: stock || null,
      category: category || null,
      thumbnails: thumbnails || null,
    };

    let Promesa = Promise.resolve();

    for (const key in newProduct) {
      if (newProduct.hasOwnProperty(key)) {
        const value = newProduct[key];
        if (value != null) {
          Promesa = Promesa.then(() => {
            return manager.updateProduct(product_id, key, value);
          });
        }
      }
    }

    res.json({ message: "Se actualizo correctamente" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/:pid", (req, res) => {
  
  const product_id = parseInt(req.params.pid);
  let letmessage;
  manager
    .deleteProduct(product_id)
    .then((message) => {
      console.log("entre delete")
      res.json({ message: message });
    })
    .catch((error) => res.status(404).json({ message: error }));
});

module.exports = router;
