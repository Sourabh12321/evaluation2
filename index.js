const express = require("express");
const {connection} = require("./config/db")
const {userRouter} = require("./router/user")
require('dotenv').config()
const app = express();

app.use(express.json());

app.use("/",userRouter);

app.listen(process.env.port,async (req,res)=>{
    try{
        await connection
        console.log("start working");

    }catch(err){
        res.status(401).json(err.message)

    }
})