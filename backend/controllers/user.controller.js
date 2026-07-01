import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadFile } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

// @desc    Register a new user
// @route   POST /api/v1/user/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let profilePhotoUrl = "";
    if (req.file) {
        profilePhotoUrl = await uploadFile(req.file);
    }

    await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
        profile: { 
            profilePhoto: profilePhotoUrl 
        }
    });

    return res.status(201).json({ 
        success: true,
        message: "Account created successfully" 
    });
});

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid email or password");
    }

    if (role !== user.role) {
        throw new ApiError(400, "Account does not exist for the selected role");
    }

    if (!process.env.JWT_SECRET) {
        throw new ApiError(500, "JWT secret is not configured on the server");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    const userData = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    return res.status(200)
        .cookie("token", token, { 
            httpOnly: true, 
            sameSite: "strict", 
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 
        })
        .json({ 
            success: true,
            message: `Welcome back, ${user.fullname}`, 
            user: userData 
        });
});

// @desc    Logout user / clear cookie
// @route   GET /api/v1/user/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
    return res.status(200)
        .cookie("token", "", { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0 
        })
        .json({ 
            success: true,
            message: "Logged out successfully" 
        });
});

// @desc    Update user profile
// @route   POST /api/v1/user/profile/update
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (fullname) user.fullname = fullname;
    if (email) {
        const emailExists = await User.findOne({ email, _id: { $ne: userId } });
        if (emailExists) {
            throw new ApiError(400, "Email is already taken by another account");
        }
        user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    
    if (skills) {
        user.profile.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    if (req.file) {
        const fileUrl = await uploadFile(req.file);
        user.profile.resume = fileUrl;
        user.profile.resumeOriginalName = req.file.originalname;
    }

    await user.save();

    const updatedUser = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
    };

    return res.status(200).json({ 
        success: true,
        message: "Profile updated successfully", 
        user: updatedUser 
    });
});

// @desc    Get current user profile
// @route   GET /api/v1/user/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const userId = req.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        user
    });
});