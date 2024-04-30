const express = require("express");
const path = require("path");
const app = express();
const handlebars = require("express-handlebars");
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/router.products.js");
const cartsRouter = require("./routes/router.carts.js");
const { Server } = require("socket.io");
const port = 8080;
const {handleSocketConnection} = require("../src/services/SocketService")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(
  port,
  console.log(`Server running on port ${port}`)
);
const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));



app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

app.use("/", viewsRouter);

handleSocketConnection(socketServer)

