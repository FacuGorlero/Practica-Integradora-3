const { productService } = require('../repositories/services')
const customError = require('../services/errors/customerror.js')
const { EErrors } = require('../services/errors/eum.js')
const { generateProductErrorInfo } = require('../services/errors/generateErrorinfo.js')
const { logger } = require('../utils/logger')
const {convertSort, convertAvailability, checkCategory } = require('../helper/mongohelpers.js');

class ProdcutsController {
    constructor(){
        this.productService = productService
    }

    getProducts = async (req,res)=>{
        try {
            // Desestructura los parámetros de la consulta de la solicitud
            let {
              limit = 10,
              page = 1,
              category,
              availability,
              sort,
              campo1,
              filtro1,
              campo2,
              filtro2,
              campo3,
              filtro3,
            } = req.query;
      
            // Construye el objeto de consulta para filtrar productos
            const query = {
              ...(await checkCategory(category) && { category: category }),
              ...convertAvailability(availability),
            };
      
            // Construye las opciones de paginación y ordenamiento
            const options = {
              limit: parseInt(limit),
              page: parseInt(page),
              sort: convertSort(sort, "price"),
            };
      
            // Agrega filtros adicionales al objeto de consulta si se proporcionan
            if (campo1 && filtro1) query[campo1] = filtro1;
            if (campo2 && filtro2) query[campo2] = filtro2;
            if (campo3 && filtro3) query[campo3] = filtro3;
      
            // Obtiene la lista de productos según los parámetros
            const resp = await this.service.getProducts(query, options);
      
            // Calcula los enlaces de paginación previa y siguiente
            const { prevPage, nextPage } = resp;
            const prevLink = prevPage ? `&page=${prevPage}` : "";
            const nextLink = nextPage ? `&page=${nextPage}` : "";


            return res.json({
                ...resp,
                prevLink: prevLink,
                nextLink: nextLink,
            })
        }catch (error){
            console.error(error)
            res.status(500).send('Server error')
        }
    }

    getProductById = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            if(!pid){
                customError.createError({
                    name: 'Not found a product',
                    cause: generateProductErrorInfo(filteredProduct),
                    message: 'Error, trying to found a product',
                    code: EErrors.DATABASE_ERROR,
                })
                //res.status(404).send("Product not exist")
            }
            const filteredProduct = await this.productService.getProductById(pid)
            res.json({
                status: 'succes',
                payload: filteredProduct
            })    
        }catch(error) {
            next(error)
                //res.status(500).send('Server error')
        }
    }

    addProduct = async (req,res,next)=>{
        try {
            const {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
              status,
              category,
            } = req.body
            
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to add a product',
                    code: EErrors.DATABASE_ERROR
                })
            }

            await this.productService.addProduct(title, description, price, thumbnail, code, stock, status, category)
        
            res.json({
                status: 'success',
                message: 'Product added successfully',
            })
            } catch (error) {
              next(error)
              //res.status(500).send('Server error')
        }
    }

    updateProduct = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Product to update error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to update a product',
                    code: EErrors.DATABASE_ERROR
                })
            }
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product updated successfully',
            })
        }catch(error){
            next(error)
            //res.status(500).send('server error')
        }
    }

    deleteProduct = async (req,res)=>{
        try{
            const pid = req.params.pid
            const deletedProduct = await this.productService.deleteProduct(pid)

            if (deletedProduct) {
                return res.json({
                    status: 'success',
                    message: 'Product deleted successfully'
                })
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
            })}
        }catch(error){
            logger.error(error)
            res.status(500).send('server error')
        }
    }
    getCategorys = async (req, res) => {
        try {
          // Obtiene la lista de categorías disponibles en la base de datos
          const categorys = await this.service.getCategorys();
    
          // Envía la lista de categorías si se encuentra, de lo contrario, envía un error not found
          res.sendSuccessOrNotFound(categorys, "Categorys");
        } catch(error){
            logger.error(error)
            res.status(500).send('server error')
        }
      };
}

module.exports = ProdcutsController