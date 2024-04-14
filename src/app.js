const express = require("express");
const app = express();
const port = 8080;
const ProductManager = require("./ProductManager.js");

app.use(express.json());

const manager = new ProductManager("../Products.json");

app.get("/products/:id", (req, res) => {
  const product_id = parseInt(req.params.id);

  manager
    .getProductById(product_id)
    .then((producto) => res.json(producto))
    .catch((error) =>
      res.status(404).json({ message: error })
    );
  // res.send("Hello World!");
});

app.get("/products", (req, res) => {
  let {limit}= req.query
  manager
    .getProducts(limit)
    .then((producto) => res.json(producto))
    .catch((error) => res.status(404).json({ message: error }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
