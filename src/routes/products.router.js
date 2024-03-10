const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/productManagerDb")
const productManager = new ProductManager()

router.get("/", async (req, res) => {
    try {
    const {limit = 3, page = 1, sort, query} = req.query;

    const products = await productManager.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
    });

    res.json({
        status: 'success',
        payload: products,
        /*totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
        nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,*/

        //el comentario anterior lo hice porque me parece que es un error del profesor y la informacion sale repetida 2 veces en postman.
        })
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