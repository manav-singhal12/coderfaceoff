import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";
const accountSchema=new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    public_key:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
    }
    

})

export const Account=mongoose.model('Account',accountSchema);