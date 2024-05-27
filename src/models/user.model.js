import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        phone_no: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
            index: true
        },
        username: {
            type: String,
            trim: true, 
        },
        email: {
            type: String,
            trim: true,
            default: null 
        },
        fullname: {
            type: String,
            trim: true, 
            default: null
        },
        lastname: {
            type: String,
            trim: true,
            default: null 
        },
        status:{
            type: String,
            default: null,
            enum: ["Active", "Inactive","Close","Open","Approved","Disapproved","Verified","Unverified"],
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            default: null
        },
        address:{
            type: String,
            trim: true,
            default: null
        },
        latitude:{
            type: String,
            trim: true,
            default: null
        },
        logitude:{
            type: String,
            trim: true,
            default: null
        },
        deviceId:{
            type: String,
            trim: true,
            default: null
        },
        deviceType:{
            type: String,
            trim: true,
            enum: ["ios", "android"],
            default: null
        },
        password: {
            type: String,
            default: null
        },
        refreshToken: {
            type: String,
            default: null
        },
        role: {
            type: String,
            default: "User",
            enum: ["Super_Admin", "Restaurant", "Delivery_Boy", "User"],
            trim: true
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.post('save', function () {
    if (!this.username) { // Check if username is not already set
        this.username = this._id.toString(); // Set username to _id
        this.save(); // Save the updated document to the database
    }
});

userSchema.methods.isPasswordCorrect = async function(password){
    // console.log(password);
    try {
        return await bcrypt.compare(password.toString(), this.password)
    } catch (error) {
        return error;
    }
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)