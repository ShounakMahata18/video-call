import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        // Check all the filed are properly filled
        if(!name || !email || !password){
            return res.status(400).json({ message: "All field needed" });
        }

        // Check password should be at least 6 character. 
        if (password.length < 6){
            return res.status(400).json({ message: "Password should be atleast 6 characters." });
        }

        // validate the email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email format" });
        }
        
        // validate the password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Invalid password format: Password contain at least one lowercase letter, at least one uppercase letter, at least one digit, at least one special character, at least 6 characters total" });
        }

        // check if existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exist, please use a different one",
            });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const idx = Math.floor(Math.random()*100)+1
        const randomAvater = `https://avater.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: randomAvater
        });

        // create a jwt token for authentication
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        // make cookie with the jwt token for authentication
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attack
            sameSite: "strict", //prevent CSRF attack
            secure: process.env.NODE_ENV === "production",
        });

        // return the res
        res.status(201).json({ success: true, user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            provider: newUser.provider
        }});
        
    } catch (error) {
        // handle error
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email && !password){
            return res.status(400).json({ message: "All field are required" });
        }

        const user = await User.findOne({ email }).select('+password'); 
        
        if(!user){
            return res.status(401).json({ message: "Invalid email and password" })
        }

        const isPasseordCorrect = bcrypt.compare(password, user.password);
        
        if(!isPasseordCorrect){
            return res.status(401).json({ message: "Invalid email and password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevent XSS attack
            sameSite: "strict", //prevent CSRF attack
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, user });        
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}