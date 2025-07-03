const User=require("../models/User")
const Post=require("../models/Post");
const { CustomError } = require("../middlewares/error");


const createPostController=async(req,res,next)=>{
    const {userId}=req.params;
    const{caption}=req.body;

    try {
        const user=User.findById(userId);
        if(!user)
        {
            return new CustomError("User Not Found",400)
        }

        const newPost=new Post({
            user:userId,
            caption
        })
        await newPost.save();
        user.post.push(newPost.Iid);
        await user.save();
    } catch (error) {
        next(error)
    }
}

const updatePostController=async(req,res,next)=>{
    const {postId}=req.params;
    // const{userId}=req.body;
     const{caption}=req.body;

    try {
        const post=Post.findById(postId);
        if(!post)
        {
            return new CustomError("Post Not Found",400)
        }

        const updatedPost=Post.findByIdAndUpdate(postId,{caption},{new:true})
    } catch (error) {
        next(error)
    }
}

const likesPostController=async(req,res,next)=>{
    const{userId}=req.params;
    const {postId}=req.body;

    try {
        const post=await Post.findById(postId);
        const user=await User.findById(userId);

        if(!user || !post)
        {
            throw new CustomError("Not Found", 400)
        }
        if(post.likes.includes(userId))
        {
            throw new CustomError("You already liked this user", 400)
        }
        post.likes.push(userId);
        await post.save();
        await user.save();
    } catch (error) {
        next(error)
    }
}