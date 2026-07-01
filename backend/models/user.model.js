import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: [true, "Full name is required"],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    phoneNumber: { 
        type: String, 
        required: [true, "Phone number is required"],
        trim: true
    },
    password: { 
        type: String, 
        required: [true, "Password is required"]
    },
    role: { 
        type: String, 
        enum: {
            values: ['student', 'recruiter'],
            message: "Role must be either student or recruiter"
        },
        required: [true, "Role is required"]
    },
    profile: {
        bio: { type: String, trim: true },
        skills: { type: [String], default: [] },
        experience: { type: String, default: "0" },
        resume: { type: String, default: "" },
        resumeOriginalName: { type: String, default: "" },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: { type: String, default: "" }
    },
}, { timestamps: true });


export const User = mongoose.model('User', userSchema);