const { Router } = require('express')
const ProdcutsController = require('../controller/products.controller')

const router = Router()
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategorys
} = new ProdcutsController()

router
    .get('/', getProducts)
    .get('/:pid', getProductById)
    .post('/', addProduct)
    .put('/:pid', updateProduct)
    .delete('/:pid', deleteProduct)
    .get    ("/group/categorys", getCategorys )


module.exports = router