import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true,
    },
    walletKey:[{type:String}],
    refreshToken: {
        type: String,
    }
}, { timeStamps: true });

userSchema.pre("save", 
    async function(next) {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 8);
        }
        next();
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model('User', userSchema);