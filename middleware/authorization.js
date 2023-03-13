
const authorization = (role)=>{
    return (req,res,next)=>{
        const userRole = req.body.role;
        
        if(role.includes(userRole)){
            next()
        }else{
            res.status(401).json("you are not authorized")

        }
    }
}

module.exports = {
    authorization
}