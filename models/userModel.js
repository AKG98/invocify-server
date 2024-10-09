import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    picture: {
        type: String,
        default: null,
    },
    logo:{
        type: String,
        default: null,
    },
    
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;