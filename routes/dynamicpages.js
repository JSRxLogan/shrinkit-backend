const express=require("express")
const dynamicPagesRouter=express.Router();

const {handleHomePage,handleOpenShortId,handleGetUrls}= require("../controllers/dynamicPages");
const { checkForLoggedInUsers } = require("../middlewares/authentication");

dynamicPagesRouter.post("/home", checkForLoggedInUsers, handleHomePage); // Home page route
dynamicPagesRouter.get("/:id",checkForLoggedInUsers, handleOpenShortId); // Open short URL route
dynamicPagesRouter.get("/get/my-urls",checkForLoggedInUsers,handleGetUrls)

module.exports={
    dynamicPagesRouter
}