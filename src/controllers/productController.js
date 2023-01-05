const productModel = require('../models/productModel')

const { regexPrice, regexNumber, isValidObjectId } = require('../validators/validator')



const createProduct = async function (req, res) {
    try {
        let data = req.body
        
        const { title, description, price, currencyId, currencyFormat, installments, availableSizes } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "please provide details for the Product creation" })
        }
        if (!title) {
            return res.status(400).send({ status: false, message: "please provide title" })
        }
        const duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "enter different Title" })
        }
        if (!description) {
            return res.status(400).send({ status: false, message: "please provide description" })
        }
        if (!price) {
            return res.status(400).send({ status: false, message: "please provide price" })
        }
        if (!/^[1-9]+[0-9.]*$/.test(price)) {
            return res.status(400).send({ status: false, message: "Please Provide Valid Price" })
        }

        if (currencyId && currencyId !== "INR") {
            return res.status(400).send({ status: false, message: "currencyId must be INR" })
        }
        if (currencyFormat && currencyFormat !== "₹") {
            return res.status(400).send({ status: false, message: "currencyFormat must be in ₹" })
        }

        

        let productCreated = await productModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: productCreated })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

const getProductByFilters = async function (req, res) {
    try {
        let query = req.query
        if (Object.keys(query).length > 0) {
            if (query.name && query.price) {
            
                let product = await productModel.find({title: { $regex: query.name }, price:query.price, isDeleted: false })
                if (product.length == 0) {
                    return res.status(404).send({ status: false, message: "products not found" })
                } else {
                    return res.status(200).send({ status: true, message: "Success", data: product })
                }

            }

            if(query.latest){
                let products = await productModel.find()
                products = products.reverse()
                return res.status(200).send({status: true, message: "Success", data: products})
               
            }

            if (query.name) {
                let product = await productModel.find({ title: { $regex: query.name }, isDeleted: false })
                if (product.length == 0) {
                    return res.status(404).send({ status: false, message: "products not found of given name" })
                } else {
                    return res.status(200).send({ status: true, message: "Success", data: product })
                }
            }

            if (query.price) {
                let product = await productModel.find({ price: query.price, isDeleted: false })
                if (product.length == 0) {
                    return res.status(404).send({ status: false, message: "products not found of given price" })
                } else {
                    return res.status(200).send({ status: true, message: "Success", data: product })
                }
            }

        } else {
            let allProducts = await productModel.find({ isDeleted: false }).limit(2)
            if (allProducts.length == 0) {
                return res.status(404).send({ status: false, message: "Products not found" })
            } else {
                return res.status(200).send({ status: true, message: "Success", data: allProducts })
            }
        }
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



const getProductById = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please give a valid productId" })

        let product = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }

        return res.status(200).send({ status: true, message: "Success", data: product })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }

}


const updateProduct = async function (req, res) {
    try {
        let data = req.body
        let productID = req.params.productId

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "please provide details for the Product updation" })
        }
        if (!isValidObjectId(productID)) return res.status(400).send({ status: false, message: "Given productID is not valid" })

        let product = await productModel.findOne({ _id: productID, isDeleted: false })
        if (!product) return res.status(404).send({ status: false, message: "Product not found" })

    

        var {  currencyFormat, currencyId, price, title} = data

        if (title) {
            let uniqueTitle = await productModel.findOne({ title: title })
            if (uniqueTitle) {
                return res.status(400).send({ status: false, message: "title already exist" })
            }
        }

        if (price) {
            if (!regexPrice.test(price)) {
                return res.status(400).send({ status: false, message: "please provide valid price" })
            }
        }


        if (currencyId) {
            if (!(currencyId).includes("INR")) {
                return res.status(400).send({ status: false, message: "Currency ID must be INR" })
            }
        }
        if (currencyFormat) {
            if (!(currencyFormat).includes("₹")) {
                return res.status(400).send({ status: false, message: "currencyFormat  must be ₹" })
            }
        }

        

        let updatedProduct = await productModel.findOneAndUpdate({ _id: productID }, { $set: data }, { new: true })
        return res.status(200).send({ status: true, message: "Product updated successfully", data: updatedProduct })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}



const deleteProductbyId = async function (req, res) {
    try {
        let productId = req.params.productId


        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "productId is not valid " })
        }
        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, message: "product not found" })
        }

        await productModel.updateOne({ _id: productId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: "product deleted successfully" })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.messag })
    }
}




module.exports = { createProduct, updateProduct, getProductById, getProductByFilters, deleteProductbyId }
