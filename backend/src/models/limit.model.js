import mongoose from "mongoose";

const limitSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required:true
    },
    amount: { 
        type: Number,
         required: true 
    },
    // period: { 
    //     type: String,
    //      enum: ['yearly', 'weekly', 'monthly'] 
    // },
    startDate: Date,
    endDate: Date
},{timestamps:true});

export const Limit = mongoose.model("Limit", limitSchema);