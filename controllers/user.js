const {User} = require('../models/user');
const bcrypt = require('bcryptjs');

const { createTokenForUser, verifyToken } = require('../services/authentication');

async function handleUserSignUp(req, res) {
    const { username, email, password } = req.body; // use JOI validation in production in future

    try {
        const existingUser = await User.findOne({ email });// Check if user already exists
        if (existingUser) return res.status(409).json({ success: false, message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10); // hashing password

        const newUser = await User.create({ username, email, password: hashedPassword }); // creating user with hashed password

        if (!newUser) {
            return res.status(500).json({ success: false, message: "Failed to create user, loc->handleUserSignUp" });
        }

        newUser.password = undefined; // remove password from response for security
        const token = createTokenForUser(newUser);
        res.cookie('token', token);

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (err) {
        // res.status(500).json({ success: false, message: "Server error, loc->handleUserSignUp", err });
        console.error("Signup Error:", err); // 👈 see full stack in console

        res.status(500).json({
            success: false,
            message: "Server error, loc->handleUserSignUp",
            error: err.message || "Unknown error"
        });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "email is required, loc->handleUserLogin" });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required, loc->handleUserLogin" });
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found, loc->handleUserLogin" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password, loc->handleUserLogin" });
        }

        user.password = undefined; // remove password from response for security
        const token = createTokenForUser(user);
        res.cookie('token', token);

        return res.status(200).json({ success: true, message: "Login successful", user });
    }

    catch (err) {
        res.status(500).json({ success: false, message: "Server error, loc->handleUserLogin" });
    }
}

async function verifyUserToken(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, loc->verifyUserToken" , redirectTo: "/login" });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(404).json({ success: false, message: "User not found, loc->verifyUserToken", redirectTo: "/login" });
        }
        return res.status(200).json({ success: true, user:decoded });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token, loc->verifyUserToken", redirectTo: "/login" });
    }
}

async function handleUserLogOut(req,res) {
  req.user=undefined;
  res.clearCookie('token');
  res.status(200).json({ success: true, message: "Logout successful", redirectTo: "/login" });
}

module.exports = {
    handleUserLogin,
    handleUserSignUp,
    verifyUserToken,
    handleUserLogOut
}