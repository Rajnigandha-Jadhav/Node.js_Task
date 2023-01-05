const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const { regexName,  regexEmail, regexPassword,  isValidObjectId } = require('../validators/validator')




const createUser = async function (req, res) {
    try {
        let data = req.body
        const { fullName, email, password } = data
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "please provide something to create user" })
        }

        if (!fullName) {
            return res.status(400).send({ status: false, message: "please provide fname" })
        }
        if (!regexName.test(fullName)) {
            return res.status(400).send({ status: false, message: "please provide valid name " })
        }

        
        if (!email) {
            return res.status(400).send({ status: false, message: "please provide email" })
        }
        if (!regexEmail.test(email)) {
            return res.status(400).send({ status: false, message: "please provide valid email" })
        }
        const duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: "email is already registered" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "please provide password" })
        }
        if (!regexPassword.test(password)) {
            return res.status(400).send({ status: false, message: "please provide valid password" })
        }
        
        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User created successfully", data: userData })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

// ++++++++++++++++++++++++++++++++++++ login Api  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const userLogin = async function (req, res) {
    try {
        const data = req.body
        const { email, password } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "body should not be empty" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: 'please provide email' })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: 'please provide password' })
        }

        let user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({ status: false, message: 'email does not exist' })
        }
        let token = jwt.sign({
            userId: user._id,

        }, 'Node.js_Task',
            { expiresIn: "5hr" })


        let obj = { userId: user._id, token: token }
        
        res.status(201).send({ status: true, message: 'log in successfully', data:obj})


    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


module.exports = { createUser, userLogin}