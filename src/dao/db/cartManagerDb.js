const CartModel = require("../models/carts.model");

const ProductManagerDb = require("../db/productManagerDb");
const productManagerDb = new ProductManagerDb();

class CartManager{
    async createCart(){
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            
            return newCart;
        } catch (error) {
            console.log("Error al crear el nuevo carrito.");
        }
    }

    async getCartById(cid){
        try {
            const cart = await CartModel.findById(cid);

            if(!cart){
                console.log("El carrito no existe.");
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error al solicitar el carrito.", error)
        }
    }

    async addProductToCart(cid, productId, quantity = 1){
        try {
            const product = await productManagerDb.getProductById(productId);

            if(!product){
                console.log("Producto no existente.");
                return;
            }

            const cart = await this.getCartById(cid);

            const existProduct = cart.products.find(item => item.product.toString() === productId);

            if(existProduct){
                existProduct.quantity += quantity;
            }else{
                cart.products.push({product: productId, quantity});
            }

            //marca la ultima propiedad modificada que se genero antes de guardar.
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error al agregar el product al carrito.", error);
        }
    }
}

module.exports = CartManager;