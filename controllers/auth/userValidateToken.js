const User = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = async function validateUserToken(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ Error: "Unauthorized - Missing token" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Unauthorized - Invalid token" });
        }

        req.user = decoded;

        const loggedInUser = req.user;

        const user = await User.findOne({ _id: loggedInUser?.userId });

        if (!user) {
            return res.status(404).json({ Error: "Invalid token" });
        }
        else {
            res.status(200).json({
                data: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                },
                message: "Token is valid",
            })
        }
    })
}