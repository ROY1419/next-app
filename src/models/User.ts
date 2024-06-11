import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: { // Ensure this matches the intended property name
        type: Date,
        required: true,
        default: Date.now
    }

})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: Date;
    verifyCodeExpiry: Date;
    isVerifed: boolean;
    isAcceptingMessages: boolean;
    message: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please use a vaild email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]

    },
    verifyCode: {
        type : Date,
        required: [true, "verify code is requuired"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiryis required"]
    },
    isVerifed: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false
    },
    message: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel
