const express=require("express");
const router =express.Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { register, login, logout, refetchUser } = require("../controllers/authController");

//Register User Route

router.post("/register",register)


router.post("/login",login)

// logout route

router.get("/logout",logout)

router.get("/refetch-user",refetchUser)



module.exports=router;