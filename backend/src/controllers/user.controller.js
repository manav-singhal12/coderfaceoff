import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

import { User } from '../models/user.model.js'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    console.log(req.body)
    console.log(username,password)
    const existingUser = await User.findOne({
        $or: [{ username }]
    })
    if (existingUser) {
        throw new ApiError(400, "Username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        username, fullname, email, password, avatar: avatar.url, 
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(201).json(new ApiResponse(201, "User created successfully", createdUser))
})

const Login = asyncHandler(async(req ,res)=>{
    const {email , userName , password} = req.body;
console.log(email )
console.log(password)
    if(!(userName||email)){
        throw new ApiError(400 , "enter email or password ")
    }
    const user = await User.findOne({
        $or:[{email},{userName}]
    })
    if(!user){
        throw new ApiError(404 ,"user not found please check the username or email ")
    }
    // console.log(user)
    const isPasswordValid = await user.isPasswordCorrect(password) 
    if(!isPasswordValid){
        throw new ApiError(400 , "invalid password , try again ")
    }
//  console.log(user._id)
    const {accessToken ,refreshToken} = await generateAccessAndRefreshTokens(user._id)
const loggedIn = await User.findById(user._id).select("-password -refreshToken")

const options ={
    httpOnly:true,
    // secure:true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "None"
  }
 
  console.log('success')
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
       new ApiResponse(
          200,
          {
             user: loggedIn , accessToken ,
             refreshToken
          },
          "user logged in successully"
       )
    )
   
})
const loginUser = asyncHandler(async (req, res) => {
    console.log("Login request received");

    const { username, password } = req.body;
    console.log(username,password)
    const user = await User.findOne({
        $or: [{ username }]
    })
    if (!user) {
        throw new ApiError(401, "Invalid username or password");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // console.log("TokjenaccessToken,refreshToken);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
       sameSite:"none",  
        // secure: true,   
        secure: process.env.NODE_ENV !== "development"
        // secureProtocol: 'TLSv1_2_method',
        

    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken, refreshToken
        }, "User logged in successfully")
    )
})
// const loginUser = asyncHandler(async (req, res) => {
//     console.log("Request Body:", req.body); 
//     console.log("Login request received"); 
//     const { username, password } = req.body;
//     console.log(username,password);
//     const user = await User.findOne({
//         $or: [{ username }]
//     })
//     if (!user) {
//         throw new ApiError(401, "Invalid username or password");
//     }

//     const isPasswordCorrect = await user.isPasswordCorrect(password);
//     if (!isPasswordCorrect) {
//         throw new ApiError(401, "Invalid password");
//     }
//     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
//     const options = {
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//         secureProtocol: 'TLSv1_2_method',
//     }

//     return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(
//         new ApiResponse(200, {
//             user: loggedInUser,
//             accessToken, refreshToken
//         }, "User logged in successfully")
//     )
// })


const logoutUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        // $set: {
        //     refreshToken: undefined,
        // }
        //or
        $unset:{
            refreshToken:1
        }
    }, {
        new: true
    }
    )
    console.log(user);
    const options = {
        httpOnly: true,
        sameSite: "none",
        // secure: true,
        secure: process.env.NODE_ENV !== "development"
        // secureProtocol: 'TLSv1_2_method'
    }
    console.log("logiing out")
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})  


const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email, password, newPassword, walletKey } = req.body;

    // console.log(req.user);
    console.log(req.body);

    if (!req.user || !req.user.id) {
        throw new ApiError(401, "Unauthorized: User not found in request");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // ✅ Handle password update if needed
    if (newPassword) {
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Old password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
    }

    // ✅ Ensure `walletKey` is correctly updated
    if (walletKey) {
        if (!Array.isArray(user.walletKey)) {
            user.walletKey = []; // Ensure it is an array
        }

        // Only push new wallet keys that don't already exist
        if (!user.walletKey.includes(walletKey)) {
            user.walletKey.push(walletKey);
        }
    }

    // ✅ Update other fields
    console.log(user.fullname);
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;

    // ✅ Save the updated user document
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
});



export { registerUser, loginUser, logoutUser,updateProfile };
