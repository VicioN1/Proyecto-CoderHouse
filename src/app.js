const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/router.products.js");
const cartsRouter = require("./routes/router.carts.js");
const { Server } = require("socket.io");
const port = 8080;
const mongoose = require("mongoose");
const {handleSocketConnection} = require("../src/dao/services/SocketService.js")
const dotenv = require("dotenv");




dotenv.config()
console.log(process.env.MONGO_URL)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))

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

handleSocketConnection(socketServer)

