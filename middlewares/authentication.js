require('dotenv').config();
const {verifyToken}=require("../services/authentication")

const checkForLoggedInUsers = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not logged in", redirectTo: "/login" });
  }

  try {
    const payload = verifyToken(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user info to request object
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid", redirectTo: "/login" });
  }
};

module.exports={
    checkForLoggedInUsers
}