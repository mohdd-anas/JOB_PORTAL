import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabase.js";
import { mapUser } from "../utils/mappers.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

const fileToDataUrl = (file) => {
    if (!file) return "";
    const base64 = file.buffer.toString("base64");
    return `data:${file.mimetype};base64,${base64}`;
};

export const register = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, password, role } = req.body;

    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle();
    if (existing) throw new ApiError(400, "User with this email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhotoUrl = req.file ? fileToDataUrl(req.file) : "";

    const { data, error } = await supabase
        .from("users")
        .insert({
            fullname,
            email: email.toLowerCase(),
            phone_number: phoneNumber,
            password: hashedPassword,
            role,
            profile_photo: profilePhotoUrl,
        })
        .select()
        .single();

    if (error) throw new ApiError(500, error.message);

    return res.status(201).json({
        success: true,
        message: "Account created successfully",
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();

    if (!user) throw new ApiError(400, "Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(400, "Invalid email or password");

    if (role !== user.role)
        throw new ApiError(400, "Account does not exist for the selected role");

    if (!process.env.JWT_SECRET)
        throw new ApiError(500, "JWT secret is not configured on the server");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const userData = mapUser(user);
    delete userData.password;

    return res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        })
        .json({
            success: true,
            message: `Welcome back, ${user.fullname}`,
            user: userData,
        });
});

export const logout = asyncHandler(async (req, res, next) => {
    return res.status(200)
        .cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
    if (!user) throw new ApiError(404, "User not found");

    const updates = {};
    if (fullname) updates.fullname = fullname;
    if (email) {
        const { data: emailExists } = await supabase
            .from("users")
            .select("id")
            .eq("email", email.toLowerCase())
            .neq("id", userId)
            .maybeSingle();
        if (emailExists) throw new ApiError(400, "Email is already taken by another account");
        updates.email = email.toLowerCase();
    }
    if (phoneNumber) updates.phone_number = phoneNumber;
    if (bio !== undefined) updates.bio = bio;

    if (skills) {
        updates.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.file) {
        updates.resume = fileToDataUrl(req.file);
        updates.resume_original_name = req.file.originalname;
    }

    const { data: updated, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

    if (error) throw new ApiError(500, error.message);

    const updatedUser = mapUser(updated);
    delete updatedUser.password;

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
    });
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const userId = req.id;

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (!user) throw new ApiError(404, "User not found");

    const userData = mapUser(user);
    delete userData.password;

    return res.status(200).json({
        success: true,
        user: userData,
    });
});
