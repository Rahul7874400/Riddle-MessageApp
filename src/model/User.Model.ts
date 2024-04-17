import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document {
    content : string
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
})


export interface User extends Document {
    username : string
    email : string
    password : string
    verifyCode : string
    verifyCodeExpiry : Date
    isVerified : boolean
    isAccepting : boolean
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true , "User name is requiued"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true,
        match : [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/ ,"Please use valid email address"]
    },
    password : {
        type : String,
        required : [true , "Passweord is required"]
    },
    verifyCode :{
        type : String,
        required : [true , "Verify code is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true , "Verify Code Expiry is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAccepting : {
        type : Boolean,
        default :true
    },
    messages : {
        type : [MessageSchema]
    }
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User" , UserSchema)

export default UserModel