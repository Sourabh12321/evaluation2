const express = require("express");
const {userModel} = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const {authorization} = require("../middleware/authorization")
const {blacklist} = require("../middleware/blacklist")
const {auth} = require("../middleware/authentication")
const {blacklistModel} = require("../model/blacklist")
require('dotenv').config()


userRouter.post("/signup", async (req,res)=>{
    const {username,email,password,role} = req.body;
    const arr = ["seller","user"];
    if(arr.includes(role)){
        try{
            bcrypt.hash(password,5,async (err,hash)=>{
                if(err){
                    res.status(401).json(err.message)
                }else{
                    const user = new userModel({username,email,password:hash,role});
                    await user.save();
                    res.send("user created")

                }
            })


        }catch(err){
            res.status(401).json(err.message);
    
        }

    }else{
        res.send("something went wrong");
    }
    
})

userRouter.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try{
        const data = await userModel.find({email:email});
        console.log(data);
        if(data.length>0){
            bcrypt.compare(password,data[0].password,async (err,result)=>{
                if(err){
                    res.status(401).json(err.message)
                }else{
                    let token = jwt.sign({userid:data[0]._id},process.env.key,{
                        expiresIn:60
                    });
                    let refreshtoken = jwt.sign({userid:data[0]._id},process.env.secret,{
                        expiresIn:300
                    });
                    res.send({"token":token,"refreshtoken":refreshtoken});
                }

            })
        }

    }catch(err){
        res.status(401).json(err.message)

    }
})
userRouter.post("/logout",async (req,res)=>{
    try{
        const token = req.headers.authorization;
        const black = new blacklistModel({"token":token})
        await black.save();
       
        res.send("logout successfully")

    }catch(err){
        res.status(401).json(err.message)
    }
    

})

userRouter.get("/products",blacklist, auth, authorization(["user","seller"]),(req,res)=>{
    res.send("products are here...")
})
userRouter.get("/addproducts",blacklist, auth, authorization(["seller"]),(req,res)=>{
    res.send("add the products")
})
userRouter.get("/deleteproducts",blacklist,auth, authorization(["seller"]),(req,res)=>{
    res.send("delete the products")
})

userRouter.get("/refreshtoken",async (req,res)=>{
    const rtoken = req.headers.authorization;

    if(!rtoken){
        res.send("login again")
    }else{
        jwt.verify(rtoken,process.env.secret,(err,decoded)=>{
            if(err){
                res.status(401).json(err.message)
            }else{
                let token = jwt.sign({userid:decoded.userid},process.env.key,{
                    expiresIn:60
                })
                res.send({"token":token});
                
            }
        })
    }
})

module.exports ={
    userRouter
}