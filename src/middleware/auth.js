const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userModel = require('../models/userModel')



const authentication = async function (req, res, next) {
    try {
        
        let token = req.headers["authorization"]

        if (!token) {
            return res.status(401).send({ status: false, message: 'please provide token' })
        }
        
        let bearerToken = token.split(' ')[1]
       
        
        jwt.verify(bearerToken, 'Node.js_Task', function (err, decodedToken) {
            if (err) {
                return res.status(401).send({ status: false, message: 'please provide valid token' })
            }
          
            next()
        })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}







module.exports = { authentication }



