// Map Supabase flat rows to the nested MongoDB-style shapes the frontend expects

export const mapUser = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        fullname: row.fullname,
        email: row.email,
        phoneNumber: row.phone_number,
        role: row.role,
        password: row.password,
        profile: {
            bio: row.bio || "",
            skills: row.skills || [],
            experience: row.experience || "0",
            resume: row.resume || "",
            resumeOriginalName: row.resume_original_name || "",
            profilePhoto: row.profile_photo || "",
            company: row.company_id || null,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const mapCompany = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        name: row.name,
        description: row.description || "",
        website: row.website || "",
        location: row.location || "",
        logo: row.logo || "",
        userId: row.user_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const mapJob = (row, company, applications) => {
    if (!row) return null;
    return {
        _id: row.id,
        title: row.title,
        description: row.description,
        requirements: row.requirements || [],
        salary: Number(row.salary),
        location: row.location,
        jobType: row.job_type,
        experienceLevel: row.experience_level,
        position: row.position,
        company: company || null,
        created_by: row.created_by,
        applications: applications || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const mapApplication = (row, job, applicant) => {
    if (!row) return null;
    return {
        _id: row.id,
        job: job || row.job_id,
        applicant: applicant || row.applicant_id,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};
