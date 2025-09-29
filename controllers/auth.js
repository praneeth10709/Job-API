const User=require("../models/User")
const {StatusCodes}=require('http-status-codes')
const BadRequestError=require('../errors/bad-request.js')
const UnauthenticatedError=require('../errors/unauthenticated.js')

const register=async(req,res)=>{
    const user=await User.create({...req.body})
    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login= async(req,res)=>{
    const {email,password}=req.body 
    if (!email||!password){
        throw new BadRequestError("Please provide Enail and Password")
    }
    const user=await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const ispassword=await user.match(password)
    if(!ispassword){
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

module.exports={login,register}