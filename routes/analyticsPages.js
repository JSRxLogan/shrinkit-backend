const express=require("express")
const analyticsRouter=express.Router();

const {handleQuickAnalytics,handleDetailedAnalytics}= require("../controllers/analyticsPages");
const { checkForLoggedInUsers } = require("../middlewares/authentication");

analyticsRouter.get("/quick/:id",checkForLoggedInUsers,handleQuickAnalytics)
analyticsRouter.get("/detailed/:id",checkForLoggedInUsers,handleDetailedAnalytics)

module.exports={
   analyticsRouter
}