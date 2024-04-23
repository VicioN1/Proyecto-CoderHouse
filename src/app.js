const express = require("express");
const path = require("path")
const app = express();
const productsRouter = require("./routes/router.products.js")
const cartsRouter = require("./routes/router.carts.js")
const port = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/products/", productsRouter)
app.use("/api/carts/", cartsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
