const express = require("express");
const router = express.Router();

const CartManager = require("../dao/db/cartManagerDb");
const cartManager = new CartManager();


router.post("/", async (req, res) =>{
    try {
        await cartManager.createCart();
        res.json({message: "Carrito creado exitosamente."});
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/:cid", async (req, res)=>{
    const {cid} = req.params;

    try {
        const cart = await cartManager.getCartById(cid);

        if(!cart){
            res.status(400).json({message: "Carrito no encotrado"});
            return null;
        }
        res.json(cart.products);
    } catch (error) {
        console.error("Error al buscar carrito", error);
        res.status(500).json({error: "Error interno del servidor."});
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cartUpdate = await cartManager.addProductToCart(cid, pid, quantity);
        
        if(!cartUpdate){
            res.send({status: "failure", message: "Producto no agregado al carrito"});
            return;
        }

        res.json(cartUpdate.products);
    } catch (error) {
        console.error("Error al agregar el producto.", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

module.exports = router;