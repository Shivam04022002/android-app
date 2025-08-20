import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const JWT_SECRET = process.env.JWT_SECRET || "keywasherebutitwillchanged";

const loginUser = async (req, res) => {
    console.log("Login request received:", req.body);
    
    const { email, password } = req.body;
    if (!email || !password) 
        return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "Invalid email or password1" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "9h" });
    res.json({
        token,
        user: {
            name: user.Name  || user.name, // Use Name if available, otherwise fallback to name
            email: user.email,
            
        }
       
        
    });
     console.log(user);
};




export default loginUser ;