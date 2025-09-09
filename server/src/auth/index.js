const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")
require("dotenv").config()
const extractToken = (req) => {
    let token = req.headers['authorization'];
    if (!token) return null;

    if (token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
    }
    return token;
};



const authenticateToken = async (req, res, next) => {
    try {

        const token = extractToken(req)

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }

        console.log("token", token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        console.log(decodedToken)
        req._id = decodedToken.userId;
        req.role = decodedToken.role;
        await userModel.findByIdAndUpdate(decodedToken.userId, { $set: { lastLogin: Date.now() } }, { new: true })

        next();
    } catch (error) {

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




const userAuthorisation = async function (req, res, next) {

    try {

        if (req.role !== "user") {
            return res.status(403).json({ status: false, msg: "You are not authorized to perform this task because you are not user" });
        }
        next();
    } catch (error) {


        return res.status(500).json({ succss: false, message: "internal server error" })
    }

}


const adminAuthorisation = async function (req, res, next) {

    try {

        if (req.role !== "admin") {

            return res.status(403).json({ status: false, msg: "You are not authorized to perform this task because you are not admin" });
        }
        next();
    } catch (error) {


        res.status(500).json({ succss: false, message: "internal server error" })
    }

}



module.exports = { authenticateToken, userAuthorisation, adminAuthorisation }