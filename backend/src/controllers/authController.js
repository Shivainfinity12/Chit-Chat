import mongoose from "mongoose";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        // 1. validate user input
        if(!email || !password || !fullName) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        
        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({message: "Email already exists"});
        }
            
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
            
            
        const newUser = new User({fullName, email, password: hashedPassword, profilePic: ""}); 

        if(newUser) {
            // generate jwt token here
            generateToken(newUser._id, res)   // res -> so that it can send the cookie in the response
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
        
}

   
export const login = async (req, res) => {
    const {email, password} = req.body;
    

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
        
    }

}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // after upload the image then we need to update the profile pic in the database
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updated profile : ", error);
        res.status(500).json({message:"Internal server error"});
        
    }
    
}

// we are gonna call the function whenever we refresh the application
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);  // just send the user back to the client
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}