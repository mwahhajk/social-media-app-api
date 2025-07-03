const User=require("../models/User")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const register=async (req,res)=>{

    console.log("signup")

    // console.log(req.body)
    // return res.json({msg:"This is social media api signup page"})

    try {
       const{email,username,password}=req.body;
        console.log(email)
    //    const existingUser=await User.findOne({$or:[{username},{email}]});
          const existingUser=await User.findOne({email})
        console.log(existingUser)
       if(existingUser)
       {
        console.log("checking existing user")
        return res.status(400).json({msg:"User Already Exist"})
       }
       console.log("passed")
       const salt=await bcrypt.genSalt(10);
       const hashPass=await bcrypt.hashSync(password,salt)
       const newUser=new User({...req.body,password:hashPass})
       const savedUser=await newUser.save();
       return res.status(201).json({user:savedUser})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


const login=async (req,res)=>{
    try{
        // console.log("login")

        let user;
        if(req.body.email)
        {
            user=await User.findOne({email:req.body.email})
            console.log(user.email)
        }
        else if(req.body.username)
        {
            user=await User.findOne({username:req.body.username})
        }
      
        if(!user){
            return res.status(400).json({msg:"User Not Found"})
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password)
        
        if(!isMatch)
        {
            return res.status(400).json({msg:"Wrong Credentials"})
        }
        // return res.status(200).json({msg:"User Login Successfully"})
        const{password,...data}=user._doc;
        console.log(data)
        const token=jwt.sign({_id:user._id},"asdfghj",{expiresIn:"4d"})
        return res.cookie("token",token).status(200).json(data)


    }

    catch(error){
        return res.status(500).json({err:error})
    }
}

//logout controller

const logout=(req,res)=>{
    try {

        return res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json({msg:"User logout successfully"})
        
    } catch (error) {
        return res.status(500).json({err:error.message})
    }
}


// Refetch User Controller

const refetchUser=async (req,res)=>{

    // console.log("refetch user")
    try {

        const token=req.cookies.token;

        console.log(token)
        jwt.verify(token,"asdfghj",async (err,data)=>{
            if(err)  
            {
                return res.status(400).json({err:err})
            }
            try{
            const _id= data._id;

            const user=await User.findOne({_id})
            res.status(200).json(user)
            }
            catch(err){

            }
        })
        
    } catch (error) {
        
    }
    
    
}

module.exports={register,login,logout,refetchUser}