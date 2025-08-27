const JWT=require("jsonwebtoken")

require('dotenv').config();

const secret=process.env.SECRET_KEY

function createTokenForUser(user){
    const payload={
        id:user._id,
        email:user.email,
        userName:user.userName
    }

    const token=JWT.sign(payload,secret)

    return token
}

function verifyToken(token){
    const payload=JWT.verify(token,secret)
    return payload
}

module.exports={
    createTokenForUser,
    verifyToken
}