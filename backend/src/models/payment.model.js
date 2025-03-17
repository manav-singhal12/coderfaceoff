import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

const paymentSchema=new Schema({
    // wallet_id:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Account',
    //     required:true
    // },
    sender_key:{
        type:String,
        required:true
    },
    receiver_key:{
        type:String,
        required:true
    },
    receivername:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    signature:{
        type:String,
        required:true
    } ,
    time:{
        type:Date,
        // default:Date.now,
    }
},{timestamps:true})

export const Payment=mongoose.model('Payment',paymentSchema);