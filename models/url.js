const {Schema,model}=require("mongoose");

const urlSchema=new Schema({
      url:{
        type:String,
        required:true,
      },

      length:{
        type:Number,
        required:true,
      },

      shortId:{
        type:String,
        required:true,
        unique:true
      },

      shortUrl:{
        type:String,
        required:true,
      },

      user:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
      },

      countryName:{
        type:String,
        required:true
      },

      clickCounts:{
        type:Number,
        default:0
      }

},{timestamps:true})


const Url = model("url",urlSchema);

module.exports={
    Url
}