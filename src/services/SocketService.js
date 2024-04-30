const path = require("path");
const ProductManager = require("./ProductManager");

const manager = new ProductManager(
  path.join(__dirname, "../data/Products.json")
);

function handleSocketConnection(socketServer) {
    socketServer.on('connection', socket => {
        console.log("Nuevo cliente conectado");
        

        socket.on('productos', async product => {
            try {
                await writeProducts(product);
                const products = await readProducts(); 
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });
        socket.on('new', async product => {
            try {
                const products = await readProducts();
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        socket.on('eliminarProducto', async productId => {
            try {
                console.log(productId)
                await deleteProducts(productId);
                const newproducts = await readProducts(); 
                socketServer.emit('realTimeProducts', newproducts);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log("Cliente desconectado");
        });
    });
}

async function readProducts() {
    try {
        const products = await manager.getProducts();
        return products;
    } catch (error) {
        throw error; 
    }
}

async function writeProducts(products) {
    try {
        const producto = await manager.addProduct(products.title, products.description, products.code, products.price, products.stock, products.category, products.thumbnails); // Espera a que se complete la escritura del producto
        console.log(producto);
    } catch (error) {
        throw error; 
    }
}
async function deleteProducts(product_id) {
    try {
        const id = parseInt(product_id);
        await manager.deleteProduct(id); 
        console.log("Producto eliminado:", id);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error; 
    }
}

module.exports = { handleSocketConnection };
