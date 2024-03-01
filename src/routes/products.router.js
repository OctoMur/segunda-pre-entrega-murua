const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/productManagerDb")
const productManager = new ProductManager()

// const productsModel = require("../models/products.model");

router.get("/", async (req, res) => {
    try {
    const limit = parseInt(req.query.limit);

    const products = await productManager.getProducts();
    
        if (!isNaN(limit) && limit > 0) {
            const productsListLimited = products.slice(0, limit);
            res.send(productsListLimited);
        } else {
            res.send(products);
        }
    } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.send("Error interno del servidor");
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid;

        // Busca el producto por ID
        const foundProduct = await productManager.getProductById(id);
    
        if (foundProduct) {
            res.json(foundProduct);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }

        } catch (error) {
        // console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
});

router.post("/", async (req, res) =>{
    const newProduct = req.body;

    const added = await productManager.addProduct(newProduct);

    if(added){
        res.send({status:"sucess", message: "producto creado"});
    }else{
        res.send({status:"failure", message:"producto no creado"});
    }
})

router.put("/:pid", async (req, res) =>{
    const {pid} = req.params;
    const productUpdated = req.body;

    console.log(pid);

    const updated = await productManager.updateProduct(pid, productUpdated);

    if(updated){
        res.send({status:"sucess", message: "producto actualizado"});
    }else{
        res.status(404).send({message: "El producto que desea actualizar no existe"});
    }
    
})

router.delete("/:pid", async (req, res) =>{
    const {pid} = req.params;

    const deleted = await productManager.deleteProduct(pid);
    
    if(deleted){
        res.send({status: "success", message: "Producto eliminado"});
    }else{
        res.status(404).send({message: "el producto no se elimino, ID no encontrada"});
    }
})

module.exports = router;