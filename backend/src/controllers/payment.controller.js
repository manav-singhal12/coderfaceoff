import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Payment } from "../models/payment.model.js";
import { Account } from "../models/account.model.js";

const sendPayment = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { sender_key, receiver_key, receivername, amount, category, signature, time } = req.body;

    if (!receivername) {
        return res.status(400).json({ message: "Receiver name is required" });
    }
    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }

    const sender = await Account.findOne({ public_key: sender_key });
    if (!sender) {
        return res.status(400).json({ message: "Sender key does not exist" });
    }

    const payment = await Payment.create({
        sender_key,
        receiver_key,
        receivername,
        amount,
        category,
        signature,
        time,
    });

    return res.status(200).json({ message: "Payment sent successfully", payment });
});


const getPayments=asyncHandler(async(req,res)=>{
    console.log(req.body);
    const payments=await Payment.find().populate("sender_key");
    return res.status(200).json({ message: "Payments fetched successfully", payments });
})

export{sendPayment,getPayments};