const { Router } = require('express')
const ViewsController = require('../controller/views.controller');
const { isAdmin, isUser } = require('../midlewares/roleverification')
const { isAuthenticated } = require('../midlewares//auth.midleware')


const router = Router()

const {
    home,
    realTimeProducts,
    chat,
    products,
    productsDetails,
    login,
    register,
    shoppingCart
} = new ViewsController()

router.get('/', home)

router.get('/realTimeProducts', isAdmin, realTimeProducts)

router.get('/chat',isUser , chat)

router.get('/products', products)

router.get('/products/details/:pid', productsDetails)

router.get('/login', login)

router.get('/register', register)

router.get('/cart', isAuthenticated, shoppingCart)

/* router.get('/logout', async (req,res) =>{
    res.render('login')
}) */

module.exports = router