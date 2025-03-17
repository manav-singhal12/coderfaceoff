import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

export const connectDB = async () => {
    try{
        const connection=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,);
        console.log(`MongoDB connected: ${connection.connection.host}`);

    }
    catch(err){
        console.error(`Error: ${err.message}`);
        
        process.exit(1);
    }
};

export default connectDB;