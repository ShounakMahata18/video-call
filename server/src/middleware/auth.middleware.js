import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decode.userId).select("-password");
        if (!user){
            return res.status(401).json({ message: "user not found" });
        }

        req.user = user;

        // call the next part
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
