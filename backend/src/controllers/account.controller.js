import asyncHandler from "../utils/asyncHandler.js";
import { Account } from '../models/account.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const addAccount = asyncHandler(async (req, res) => {
    console.log("received")
    // console.log(public_key,balance);
    const { public_key, balance } = req.body;
    console.log(public_key,balance);

    const existingAccount = await Account.findOne({

        public_key

    })
    if (existingAccount) {
        return res.status(401).json(new ApiResponse(401,"Account Already exists"));
    }
    const newAccount = await Account.create({
        user_id: req.user._id,
        public_key,
        balance
    })
    return res.status(201).json(new ApiResponse(201,"Account added successfully"));

})

const getAccounts=asyncHandler(async(req,res)=>{
    console.log("Req recieved");
    const userId=req.user._id;
    console.log(userId);
    if(!userId){
        throw new ApiError(401,"Unauthorized ");
    }
    const accounts=await Account.find({user_id:userId}).populate('user_id');
    if(!accounts){
        return res.status(404).json(new ApiResponse(404,"No accounts found"));
    }
    return res.status(200).json(new ApiResponse(200,"Accounts found",accounts));
})


export {addAccount,getAccounts};