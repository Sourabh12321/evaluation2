const {blacklistModel} = require("../model/blacklist")


const blacklist = async (req,res,next)=>{
    const token = req.headers.authorization;
    try{
        let data = await blacklistModel.find({"token":token});
        if(data.length>0){
            res.send("login again")
        }else{
            next();

        }

    }catch(err){

    }



}

module.exports={
    blacklist
}