import { z } from "zod";
import { ApiError } from "./errorHandler.js";

// Helper regex for UUID check (Supabase uses UUIDs)
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Define Zod schemas
export const registerSchema = z.object({
    fullname: z.string().min(1, "Full name is required").max(100),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "recruiter"], {
        errorMap: () => ({ message: "Role must be either student or recruiter" }),
    }),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["student", "recruiter"], {
        errorMap: () => ({ message: "Role must be either student or recruiter" }),
    }),
});

export const companyRegisterSchema = z.object({
    companyName: z.string().min(1, "Company name is required").max(100),
});

export const companyUpdateSchema = z.object({
    name: z.string().min(1, "Company name cannot be empty").optional(),
    description: z.string().optional(),
    website: z.string().url("Invalid website URL").or(z.string().max(0)).optional(), // allow URL or empty string
    location: z.string().optional(),
});

export const jobPostSchema = z.object({
    title: z.string().min(1, "Job title is required"),
    description: z.string().min(1, "Job description is required"),
    requirements: z.string().or(z.array(z.string())),
    salary: z.preprocess((val) => Number(val), z.number().min(0, "Salary must be a positive number")),
    location: z.string().min(1, "Location is required"),
    jobType: z.string().min(1, "Job type is required"),
    experience: z.preprocess((val) => Number(val), z.number().min(0, "Experience cannot be negative")),
    position: z.preprocess((val) => Number(val), z.number().int().min(1, "Number of positions must be at least 1")),
    companyId: z.string().regex(uuidRegex, "Invalid Company ID format"),
});

export const applicationStatusSchema = z.object({
    status: z.enum(["pending", "accepted", "rejected", "shortlisted"], {
        errorMap: () => ({ message: "Invalid status value" }),
    }),
});

// Middleware factory for validation
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate req.body by default
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
                next(new ApiError(400, "Validation failed", errorMessages));
            } else {
                next(error);
            }
        }
    };
};
