const express=require("express")
const userRouter=express.Router();

const {handleUserLogin,handleUserSignUp,verifyUserToken,handleUserLogOut}=require("../controllers/user")

userRouter.post("/signup",handleUserSignUp)
userRouter.post("/login",handleUserLogin)
userRouter.get("/verify",verifyUserToken)
userRouter.get("/logout",handleUserLogOut)

module.exports={
    userRouter
}