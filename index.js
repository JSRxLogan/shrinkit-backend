const PORT = process.env.PORT || 3000;

require('dotenv').config();
const express = require('express');
const cookieParser=require("cookie-parser")
const cors= require('cors');
const useragent = require('express-useragent');
const { connectMongoDb } = require('./connect');
const { userRouter } = require('./routes/user');
const {dynamicPagesRouter}=require("./routes/dynamicpages")
const {analyticsRouter} = require("./routes/analyticsPages");


connectMongoDb(process.env.MONGODB_URL)
    .then(() => console.log("Mongodb is connected"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

    

const app= express();

app.use(cors({
  origin: "http://localhost:5173", // exact React app origin
  credentials: true               // allow cookies/auth headers
}));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(useragent.express());


app.use("/api/auth", userRouter);
app.use("/api", dynamicPagesRouter);
app.use("/api/analytics", analyticsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});