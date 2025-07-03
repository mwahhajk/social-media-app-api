const User=require("../models/User")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");

// Get Usr

const getUserController=async(req,res,next)=>{
    try {

        const {userId}=req.params;
        // console.log(userId)
        const user=await User.findById(userId);
        if(!user)
        {
            throw new CustomError("User Not Found",400)
        }
        const{password,...data}=user;
        return res.status(200).json({data:data._doc})
        
    } catch (error) {
        next(error)
    }
}

//update user controller

const updateUserController=async (req,res,next)=>{
    console.log("update user")
    const{userId}=req.params;
    const updatedData=req.body;

    try {
        const userToUpdate=await User.findById(userId);
         if(!userToUpdate)
        {
            throw new CustomError("User Not Found",400);
        }
        Object.assign(userToUpdate,updatedData)
        await userToUpdate.save();
        return res.status(200).json({msg:"User Updated successfully"})
    } catch (error) {
        next(error)
    }
}

//Follow User

const followUserController=async(req,res,next)=>{
    const {userId}=req.params;
    const{_id}=req.body

    try {
        if(userId===_id)
        {
            throw new CustomError("You can not follow yourself",400)
        }
        const loggedInUser=await User.findById(_id);
        const userToFollow=await User.findById(userId);

        if(!loggedInUser || !userToFollow)
        {
            throw new CustomError("Users Not Found",400)
        }
        if(loggedInUser.following.includes(userId))
        {
            throw new CustomError("You are already following this user",400)
        }

        // following the user
        loggedInUser.following.push(userId);
        userToFollow.followers.push(_id);

        await loggedInUser.save();
       await userToFollow.save();

       res.status(200).json({message:"Successfully follow the user!"})
        
    } catch (error) {
        next(error)
    }
}

const unfollowUserController=async(req,res,next)=>{
    const {userId}=req.params;
    const{_id}=req.body

    try {
        if(userId===_id)
        {
            throw new CustomError("You can not follow yourself",400)
        }
        const loggedInUser=await User.findById(_id);
        const userToFollow=await User.findById(userId);

        if(!loggedInUser || !userToFollow)
        {
            throw new CustomError("Users Not Found",400)
        }
        if(!loggedInUser.following.includes(userId))
        {
            throw new CustomError("You are not following this user",400)
        }

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId);
        userToFollow.followers=userToFollow.followers.filter(id=>id.toString()!==_id)

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({message:"Successfully unfollow the user!"})
        
    } catch (error) {
        next(error)
    }
}

const blockUserController=async(req,res,next)=>{

    const {userId}=req.params;
    const{_id}=req.body

    try {
        if(userId===_id)
        {
            throw new CustomError("You can not follow yourself",400)
        }
        const loggedInUser=await User.findById(_id);
        const userToBlock=await User.findById(userId);

        if(!loggedInUser || !userToBlock)
        {
            throw new CustomError("Users Not Found",400)
        }
        if(!loggedInUser.blockList.includes(userId))
        {
            throw new CustomError("You already blocked this user",400)
        }

        loggedInUser.blockList.push(userId);

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId);
        userToBlock.followers=userToBlock.followers.filter(id=>id.toString()!==_id)

        await userToBlock.save();
        await loggedInUser.save();
        

        res.status(200).json({message:"Successfully blocked user!"})
        
    } catch (error) {
        next(error)
    }

}

// unblock user controller

const unblockUserController=async(req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body
    try{
        if(userId===_id){
            throw new CustomError("You can not unblock yourself",500)
        }

        const userToUnblock=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

        if(!userToUnblock || !loggedInUser){
            throw new CustomError("User not found!",404)
        }

        if(!loggedInUser.blockList.includes(userId)){
            throw new CustomError("Not blocking is user!",400)
        }

        loggedInUser.blockList=loggedInUser.blockList.filter(id=>id.toString()!=userId)

        await loggedInUser.save()
        
        res.status(200).json({message:"Successfully unblocked user!"})

    }
    catch(error){
        next(error)
    }
}


module.exports={getUserController,updateUserController,followUserController,unfollowUserController,
                blockUserController,unblockUserController
}