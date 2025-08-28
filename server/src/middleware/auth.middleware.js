import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
    try {
        // get the cookie from req obj
        const token = req.cookies.jwt;
        console.log(token);
        // chack valid token
        if(!token){
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        
        // decode the token with the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // check valid decode
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        
        // get the user using userId
        const user = await User.findById(decoded.userId).select("-password");
        
        // check valid user
        if(!user){
            return res.status(401).json({ message: "Unauthorized: User not found" })
        }      
        // pass the user using req body
        req.user = user;

        // call the next part
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}