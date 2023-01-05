const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const cartModel = require('../models/cartModel')
const orderModel = require('../models/orderModel')
const { isValidObjectId,  isValidStatus } = require('../validators/validator')



const createOrder = async function (req, res) {
    try {
          
        let userId = req.params.userId
        let data = req.body
        let { cartId, status, cancellable } = data

        if (!cartId) {
            return res.status(404).send({ status: false, message: "cartId is required" })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "cartId is not valid" })
        }
        let user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: true, message: "user not found" })
        }
        let cart = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!cart) {
            return res.status(404).send({ status: false, message: "cart not found" })
        }
        if (status) {
            if (status != "pending")
                return res.status(400).send({ status: false, message: "Status can be only pending while creation" });
        }
        if (cancellable) {
            if (!(cancellable == "true" || cancellable == "false"))
                return res.status(400).send({ status: false, message: "cancellable should be true/false" })
        }

        let array = cart.items

        let totalQuantity = 0

        for (let i = 0; i < array.length; i++) {
            totalQuantity = totalQuantity + array[i].quantity
        }

        let Items = cart.items
        let totalPrice = cart.totalPrice
        let totalItems = cart.totalItems

        let orderCreated = await orderModel.create({ userId: userId, items: Items, totalPrice: totalPrice, totalItems: totalItems, totalQuantity: totalQuantity })

        let items1 = []
        let totalPrice1 = 0
        let totalItems1 = 0
        await cartModel.findOneAndUpdate({ _id: cart._id, userId: userId }, { $set: { items: items1, totalPrice: totalPrice1, totalItems: totalItems1 } })
        return res.status(201).send({ status: true, message: "Success", data: orderCreated })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getOrderInfo = async function(req,res){
    let userId = req.params.userId
    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "userId is not valid" })
    }

    let orders = await orderModel.find({userId:userId}).populate("userId")
    return res.status(201).send({ status: true, message: "Success", data: orders })
 
}



module.exports = { createOrder, getOrderInfo }

