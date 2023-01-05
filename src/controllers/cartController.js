const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const { isValidObjectId } = require('../validators/validator')


const createCart = async function (req, res) {
    try {
        let data = req.body
        let userId = req.params.userId
        let { cartId, productId } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }

        let usercart = await cartModel.findOne({ userId: userId })

        if (!usercart) {
            if (!productId) {
                return res.status(400).send({ status: false, message: 'please provide product id' })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: 'productId id is not valid' })
            }
            let product = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!product) {
                return res.status(404).send({ status: false, message: 'product does not exist' })
            }

            let obj = {
                productId: product._id,
                quantity: 1,
            }
            let createcart = await cartModel.create({ userId: userId, items: obj, totalPrice: product.price * obj.quantity, totalItems: 1 })

            return res.status(201).send({ status: true, message: "cart created successfully", data: createcart })
        }
        if (usercart) {

            if (!cartId) {
                return res.status(400).send({ status: false, message: 'provide cart id' })
            }
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: 'cart id is not valid' })
            }
            let cartIdInDb = await cartModel.findById(cartId)
            if (!cartIdInDb) {
                return res.status(404).send({ status: false, message: 'cart id does not exist' })
            }
            if (!productId) {
                return res.status(400).send({ status: false, message: 'please provide product id' })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: 'productId id is not valid' })
            }

            let findProduct = await productModel.findOne({ _id: productId, isDeleted: false }).select({ price: 1, _id: 0 });
            if (!findProduct) {
                return res.status(404).send({ status: false, message: 'productId id does not exist' })
            }

            let obj = {
                quantity: 1
            }
            let updateCart = await cartModel.findOneAndUpdate(
                { _id: cartIdInDb._id, "items.productId": productId, userId: userId },
                {
                    $inc: {
                        "items.$.quantity": 1,   // $ sign dynamically directs to the index number of the sub document.
                        totalPrice: obj.quantity * findProduct.price,
                    },
                },
                { new: true });

            if (!updateCart) {
                let id = data.productId
                let product = await productModel.findOne({ _id: id, isDeleted: false })
                let obj = {
                    productId: product._id,
                    quantity: 1
                }

                let updateCart = await cartModel.findOneAndUpdate(
                    { _id: cartIdInDb._id, userId: userId },
                    {
                        $push: { items: obj },
                        $inc: {

                            totalPrice: obj.quantity * product.price,
                            totalItems: 1
                        }
                    },
                    { new: true });
                return res.status(201).send({ status: true, message: "product pushed and added successfully!", data: updateCart })

            }
            return res.status(201).send({ status: true, message: "product quantity added successfully!", data: updateCart })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





module.exports = { createCart}