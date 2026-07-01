import { Company } from "../models/company.model.js";
import { uploadFile } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

// @desc    Register a new company
// @route   POST /api/v1/company/register
// @access  Private (Recruiter only)
export const registerCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.body;

    let company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName.trim()}$`, "i") } });
    if (company) {
        throw new ApiError(400, "A company with this name already exists");
    }

    company = await Company.create({ 
        name: companyName.trim(), 
        userId: req.id 
    });

    return res.status(201).json({ 
        success: true,
        message: "Company registered successfully", 
        company 
    });
});

// @desc    Get all companies for logged in recruiter
// @route   GET /api/v1/company/get
// @access  Private (Recruiter only)
export const getCompany = asyncHandler(async (req, res, next) => {
    const userId = req.id;
    const companies = await Company.find({ userId }).sort({ createdAt: -1 });
    
    return res.status(200).json({ 
        success: true,
        message: "Companies fetched successfully",
        companies: companies || [] 
    });
});

// @desc    Get company by ID
// @route   GET /api/v1/company/get/:id
// @access  Private
export const getCompanyById = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    return res.status(200).json({ 
        success: true,
        message: "Company details fetched",
        company 
    });
});

// @desc    Update company details
// @route   PUT /api/v1/company/update/:id
// @access  Private (Recruiter only)
export const updateCompany = asyncHandler(async (req, res, next) => {
    const { name, description, website, location } = req.body;
    const companyId = req.params.id;

    let company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Verify ownership
    if (company.userId.toString() !== req.id.toString()) {
        throw new ApiError(403, "You do not have permission to update this company");
    }

    // Check name uniqueness if changed
    if (name && name.trim().toLowerCase() !== company.name.toLowerCase()) {
        const nameExists = await Company.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
            _id: { $ne: companyId } 
        });
        if (nameExists) {
            throw new ApiError(400, "A company with this name already exists");
        }
        company.name = name.trim();
    }

    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;

    if (req.file) {
        const logoUrl = await uploadFile(req.file);
        company.logo = logoUrl;
    }

    await company.save();

    return res.status(200).json({ 
        success: true,
        message: "Company updated successfully", 
        company 
    });
});