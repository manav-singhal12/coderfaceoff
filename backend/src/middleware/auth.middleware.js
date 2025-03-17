import { error } from "console";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'




export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        // console.log(process.env.ACCESS_TOKEN_SECRET)

        // console.log("Received")
        console.log(req.cookies);
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        // console.log("Received")
        // console.log(token)
        if(!token){
            throw new ApiError(401,error?.message || "Unauthorized req");
        }
        console.log("Received token")
        // console.log(process.env.ACCESS_TOKEN_SECRET)

        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken){
            throw new ApiError(401,error?.message || "Token not found   ");
        }
        console.log("Decoded token",decodedToken)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("User",user)
        if(!user){
            throw new ApiError(401,error?.message || "Unauthorized");
        }
    
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized req");
        
    }

})