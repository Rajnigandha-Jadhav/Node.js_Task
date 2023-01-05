const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const middleware = require("../middleware/auth")

//------------------------------------- User APIs----------------------------------

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)


//------------------------------------- Admin APIs----------------------------------

router.post('/admin', adminController.createAdmin)
router.post('/adminlogin', adminController.adminLogin)


//------------------------------------- Product APIs----------------------------------

router.post('/products',middleware.authentication, productController.createProduct)
router.put('/updateProducts/:productId',middleware.authentication,productController.updateProduct)
router.get('/getProducts',middleware.authentication,productController.getProductByFilters)
router.get('/product/:productId', middleware.authentication, productController.getProductById)
router.delete('/product/:productId', middleware.authentication, productController.deleteProductbyId)


//------------------------------- Cart APIs --------------------------------------------

router.post('/users/:userId/cart' ,middleware.authentication,  cartController.createCart)




//------------------------------- Order APIs ----------------------------------------------

router.post('/users/:userId/orders', middleware.authentication, orderController.createOrder)
router.get('/orders/:userId', middleware.authentication, orderController.getOrderInfo)







router.all("/*", function(req, res) {
    res.status(404).send({ msg: "No such Api found" })
})


module.exports = router