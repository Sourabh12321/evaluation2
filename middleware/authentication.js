const { blacklist } = require("./blacklist");
const jwt = require("jsonwebtoken")
const { userModel } = require("../model/userModel")
require('dotenv').config()

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (decoded) {
            const user = await userModel({ "_id": decoded.userid });
            req.body = user;

            next()
        } else {
            res.status(401).json("something went wrong")
        }
    })






}

module.exports = {
    auth
}