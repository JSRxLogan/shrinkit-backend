const {Schema,model}=require("mongoose");

const ClickSchema = new Schema({
  shortId: { type: String, required: true },
  urlId: { type: Schema.Types.ObjectId, ref: 'url', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  ipAddress: { type: String },
  country: { type: String },
  userAgent: { type: String },
  browser: { type: String },
  device: { type: String },
  os: { type: String },
},{timestamps: true});


const Click = model("click", ClickSchema);

module.exports = {
    Click
}