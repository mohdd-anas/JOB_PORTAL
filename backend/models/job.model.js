import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        trim: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"]
    },
    experienceLevel: {
        type: Number,
        required: [true, "Experience level is required"],
        min: [0, "Experience level cannot be negative"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    jobType: {
        type: String,
        required: [true, "Job type is required"],
        trim: true
    },
    position: {
        type: Number, // Changed from String to Number to match controller logic
        required: [true, "Number of positions is required"],
        min: [1, "Positions must be at least 1"]
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, "Company is required"]
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator is required"]
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }]
}, { timestamps: true });

// Optimize query performance with indexes
jobSchema.index({ company: 1 });
jobSchema.index({ created_by: 1 });
jobSchema.index({ createdAt: -1 });

export const Job = mongoose.model('Job', jobSchema);