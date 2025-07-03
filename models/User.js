const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    fullName:{
        type:String,
        // required:true,
        trim:true
    },
    bio:{
        type:String,
        trim:true
    },
    profileOicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    blockList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
   }, 
   {
    timestamps:true
   }
)

const User=mongoose.model("User",userSchema);
module.exports=User;