const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/router.products.js");
const cartsRouter = require("./routes/router.carts.js");
const sessionsRouter = require("./routes/router.sessions.js");
const { Server } = require("socket.io");
const port = 8080;
const mongoose = require("mongoose");
const {
  handleSocketConnection,
} = require("../src/dao/services/SocketService.js");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo") 
const session = require("express-session") 
const passport = require("passport")
const initializePassport = require('./config/passport.config.js')



dotenv.config();
console.log(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    }),
    // cookie: { maxAge: 180 * 60 * 1000 },
  })
);

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

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
app.use('/api/sessions', sessionsRouter);
app.use("/", viewsRouter);

handleSocketConnection(socketServer);
