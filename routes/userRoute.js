const express=require("express");
const { getUserController, updateUserController, followUserController, unfollowUserController, blockUserController, unblockUserController } = require("../controllers/userController");
const router =express.Router();

router.get("/getUser/:userId",getUserController);

router.put("/updateUser/:userId",updateUserController)

router.get("/followUser",followUserController);

router.get("/unfollowUser",unfollowUserController);

router.get("/blockUser",blockUserController);

router.get("/unblockUser",unblockUserController);

module.exports=router;