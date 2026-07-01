import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, "Job ID is required"]
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Applicant ID is required"]
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected', 'shortlisted'],
            message: "Status must be pending, accepted, rejected, or shortlisted"
        },
        default: 'pending'
    }
}, { timestamps: true });

// Optimize query performance and prevent duplicate job applications
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);