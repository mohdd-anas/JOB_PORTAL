import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        logo: {
            type: String,
            default: ""
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        }
    },
    {
        timestamps: true
    }
);

// Index on userId for fast query resolution when checking recruiter companies
companySchema.index({ userId: 1 });
companySchema.index({ name: 1 });

export const Company = mongoose.model("Company", companySchema);