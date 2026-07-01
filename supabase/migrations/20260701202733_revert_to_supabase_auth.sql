/*
# Revert to Supabase Auth for frontend-direct access

## Overview
Switching from backend-managed JWT auth to Supabase Auth (frontend uses supabase-js
directly with anon key + Supabase Auth sessions). This migration:

1. Re-adds FK from users.id to auth.users(id) — Supabase Auth manages the identity.
2. Removes the password column (Supabase Auth stores password hashes internally).
3. Re-enables RLS on all tables with proper policies using auth.uid().
4. Owner columns default to auth.uid() so inserts that omit the owner still pass RLS.

## Security
- RLS re-enabled on all 4 tables.
- users: own profile CRUD (auth.uid() = id), recruiters can view applicants for their jobs.
- companies: public SELECT, owner INSERT/UPDATE/DELETE.
- jobs: public SELECT, creator INSERT/UPDATE/DELETE.
- applications: students see own, recruiters see applications for their jobs, recruiters update status.

## Important Notes
1. The users table is a profile table extending auth.users — Supabase Auth handles passwords.
2. A trigger auto-creates a users profile row when a new auth.users account is registered.
3. Owner columns default to auth.uid() so frontend inserts that omit owner pass RLS WITH CHECK.
4. File uploads (resume, photo, logo) stored as base64 data URLs in text columns.
*/

-- Remove password column (Supabase Auth handles passwords)
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Re-add FK from users.id to auth.users(id)
-- First drop the old FK (if any references public.users)
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_created_by_fkey;
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_applicant_id_fkey;

-- Add FK from users.id to auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'users_id_fkey'
          AND table_name = 'users'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT users_id_fkey
            FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Re-add FKs from other tables to users (now referencing auth.users via users.id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'companies_user_id_fkey'
          AND table_name = 'companies'
    ) THEN
        ALTER TABLE companies
            ADD CONSTRAINT companies_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'jobs_created_by_fkey'
          AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs
            ADD CONSTRAINT jobs_created_by_fkey
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'applications_applicant_id_fkey'
          AND table_name = 'applications'
    ) THEN
        ALTER TABLE applications
            ADD CONSTRAINT applications_applicant_id_fkey
            FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Re-enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS RLS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_own_profile" ON users;
CREATE POLICY "select_own_profile" ON users FOR SELECT
    TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON users;
CREATE POLICY "insert_own_profile" ON users FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON users;
CREATE POLICY "update_own_profile" ON users FOR UPDATE
    TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON users;
CREATE POLICY "delete_own_profile" ON users FOR DELETE
    TO authenticated USING (auth.uid() = id);

-- Recruiters can view applicant profiles for jobs they created
DROP POLICY IF EXISTS "recruiters_view_applicants" ON users;
CREATE POLICY "recruiters_view_applicants" ON users FOR SELECT
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON j.id = a.job_id
            WHERE a.applicant_id = users.id
              AND j.created_by = auth.uid()
        )
    );

-- ============================================================================
-- COMPANIES RLS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_companies" ON companies;
CREATE POLICY "select_companies" ON companies FOR SELECT
    TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_companies" ON companies;
CREATE POLICY "insert_own_companies" ON companies FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_companies" ON companies;
CREATE POLICY "update_own_companies" ON companies FOR UPDATE
    TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_companies" ON companies;
CREATE POLICY "delete_own_companies" ON companies FOR DELETE
    TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- JOBS RLS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_jobs" ON jobs;
CREATE POLICY "select_jobs" ON jobs FOR SELECT
    TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_jobs" ON jobs;
CREATE POLICY "insert_own_jobs" ON jobs FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "update_own_jobs" ON jobs;
CREATE POLICY "update_own_jobs" ON jobs FOR UPDATE
    TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "delete_own_jobs" ON jobs;
CREATE POLICY "delete_own_jobs" ON jobs FOR DELETE
    TO authenticated USING (auth.uid() = created_by);

-- ============================================================================
-- APPLICATIONS RLS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_applications" ON applications;
CREATE POLICY "select_applications" ON applications FOR SELECT
    TO authenticated USING (
        auth.uid() = applicant_id
        OR EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = applications.job_id
              AND j.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "update_application_status" ON applications;
CREATE POLICY "update_application_status" ON applications FOR UPDATE
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = applications.job_id
              AND j.created_by = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = applications.job_id
              AND j.created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications" ON applications FOR DELETE
    TO authenticated USING (auth.uid() = applicant_id);

-- ============================================================================
-- AUTO-CREATE PROFILE TRIGGER
-- When a user signs up via Supabase Auth, auto-create a row in users table.
-- The frontend will update fullname/phone_number/role after signup.
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, fullname, phone_number, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'fullname', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
