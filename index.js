const express=require("express");
const connectDB = require("./database/db");
const dotenv=require("dotenv")
const authRoute=require("./routes/auth.js");
const userRoute=require("./routes/userRoute.js");
const cookieParser = require("cookie-parser");


dotenv.config();
const app=express();

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute)

app.get("/",(req,res)=>{
    console.log("This is social media api home page");
    
    return res.json({msg:"This is social media api home page"})
})

const posts=[

    {id:1,post:"This is first post",content:"This is first content"},
    {id:2,post:"This is second post",content:"This is second content"},
    {id:3,post:"This is third post",content:"This is third content"},
]

app.get("/posts",(req,res)=>{
    return res.status(200).json(posts)
})

app.get("/post/:id",(req,res)=>{
    const postId=parseInt(req.params.id);
    console.log(postId);
    
    const post=posts.find((p)=>p.id===postId);
    console.log(post);
    
    if(!post){
        return res.status(201).json({msg:"There is not any with this id"})
    }
    return res.send(post)
})


app.post("/post",(req,res)=>{
    const post={id:posts.length+1,post:"post 4",content:"content 4"}
    posts.push(post);
})





app.listen(process.env.PORT,()=>{
    connectDB();
    console.log("app is running",process.env.PORT);
    
})