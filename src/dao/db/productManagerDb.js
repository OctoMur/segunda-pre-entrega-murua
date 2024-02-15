const ProductModel = require("../models/products.model");

class ProductManagerDb{
    static idProduct = 0;

    /*async verifyProducts() {
        try {
            const productsList = await this.getProducts();
            if (productsList && productsList.length > 0) {
                this.products = productsList;
            } else {
                console.log('La lista de productos está vacía o no se pudo leer.');
            }
        } catch (error) {
            console.error('Error al verificar productos:', error.message);
        }
    }*/


    async addProduct(newProduct){
        //destructuracion del objeto
        let {title, description, code, price, status, stock, category, thumbnails} = newProduct;

        //Validaciones
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            console.log("Hay uno o mas campos vacios")
            return;
        }

        const existingProduct = await productModel.findOne({code:code});

        if(existingProduct){
            console.log("Codigo ya registrado")
            return;
        }

        const product= new productModel({
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        })
        await product.save();

        //sumar el producto al array y pushear a la DB
        this.products.push(product);
        await this.saveFile(this.products);
    }

    async getProducts(){
        try {
            const products =  await ProductModel.find();
            return products;
        } catch (error) {
            console.error("Error al obtener los productos", error);
        }
    }

    async getProductById(id){
        try {
            const productFinded = await productModel.findById(id);

            if(!productFinded){
                console.log("Producto no encontrado");
            }else{
                console.log("Producto encotrado", productFinded);
                return productFinded;
            }
        } 
        catch (error) {
            console.log("Error al buscar el producto por id");
        }
    }

    async updateProduct(id, dataUpdate){
        try {
            const productUpdated = await productModel.findByIdAndUpdate(id);

            if(!productUpdated){
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto actualizado.")
            return productUpdated;
        } catch (error) {
            console.log("Error al actualizar el archivo", error)
        }
    }

    async deleteProduct(id){
        try {
            
            const productDelete = await productModel.findByIdAndDelete(id);

            if(!productDelete){
                console.log("Producto para eliminar, no encontrado.");
                return null;
            }

            console.log("Producto eliminado.")
        } catch (error) {
            console.log("Error al acceder a la base de datos.")
        }
    }
}

module.exports = ProductManagerDb;