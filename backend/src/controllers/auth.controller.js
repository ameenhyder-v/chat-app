import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";


export const signup = async (req, res) => {
    
    try {
        let { fullName, email, password } = req.body;
        
        fullName = fullName?.trim();
        email = email?.trim().toLowerCase();
        password = password?.trim();

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (fullName.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6){
            return res.status(400).json({ message: "Password must be ata least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("error from signUp controller: ", error.message);
        res.status(500).json({message: "Internal Server Error" });
    };
};


export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("error from login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwToken", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.log("error from logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic || typeof profilePic !== "string" || !profilePic.startsWith("data:image/")) {
            return res.status(400).json({ message: "Valid Profile Pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        if (!uploadResponse || !uploadResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
