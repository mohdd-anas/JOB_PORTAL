import { supabase } from "../utils/supabase.js";
import { mapCompany } from "../utils/mappers.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middlewares/errorHandler.js";

const fileToDataUrl = (file) => {
    if (!file) return "";
    const base64 = file.buffer.toString("base64");
    return `data:${file.mimetype};base64,${base64}`;
};

export const registerCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.body;

    const { data: existing } = await supabase
        .from("companies")
        .select("id")
        .ilike("name", companyName.trim())
        .maybeSingle();
    if (existing) throw new ApiError(400, "A company with this name already exists");

    const { data, error } = await supabase
        .from("companies")
        .insert({ name: companyName.trim(), user_id: req.id })
        .select()
        .single();

    if (error) throw new ApiError(500, error.message);

    return res.status(201).json({
        success: true,
        message: "Company registered successfully",
        company: mapCompany(data),
    });
});

export const getCompany = asyncHandler(async (req, res, next) => {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", req.id)
        .order("created_at", { ascending: false });

    if (error) throw new ApiError(500, error.message);

    const companies = (data || []).map(mapCompany);

    return res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        companies,
    });
});

export const getCompanyById = asyncHandler(async (req, res, next) => {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", req.params.id)
        .maybeSingle();

    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, "Company not found");

    return res.status(200).json({
        success: true,
        message: "Company details fetched",
        company: mapCompany(data),
    });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
    const { name, description, website, location } = req.body;
    const companyId = req.params.id;

    const { data: company, error: fetchErr } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .maybeSingle();

    if (fetchErr) throw new ApiError(500, fetchErr.message);
    if (!company) throw new ApiError(404, "Company not found");

    if (company.user_id !== req.id)
        throw new ApiError(403, "You do not have permission to update this company");

    const updates = {};
    if (name && name.trim().toLowerCase() !== company.name.toLowerCase()) {
        const { data: nameExists } = await supabase
            .from("companies")
            .select("id")
            .ilike("name", name.trim())
            .neq("id", companyId)
            .maybeSingle();
        if (nameExists) throw new ApiError(400, "A company with this name already exists");
        updates.name = name.trim();
    }
    if (description !== undefined) updates.description = description;
    if (website !== undefined) updates.website = website;
    if (location !== undefined) updates.location = location;
    if (req.file) updates.logo = fileToDataUrl(req.file);

    const { data: updated, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", companyId)
        .select()
        .single();

    if (error) throw new ApiError(500, error.message);

    return res.status(200).json({
        success: true,
        message: "Company updated successfully",
        company: mapCompany(updated),
    });
});
