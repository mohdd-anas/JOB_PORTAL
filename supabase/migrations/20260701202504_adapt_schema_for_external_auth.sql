/*
# Adapt schema for external JWT auth (backend-managed)

## Overview
The backend uses its own JWT auth (bcrypt + jsonwebtoken) with httpOnly cookies,
not Supabase Auth. The original users table had a FK to auth.users(id) which
requires Supabase Auth accounts. This migration:

1. Drops the FK from users.id to auth.users(id)
2. Drops the FK from companies.user_id to auth.users(id)
3. Drops the FK from jobs.created_by to auth.users(id)
4. Drops the FK from applications.applicant_id to auth.users(id)
5. Adds a password column to users (bcrypt hash)
6. Changes RLS approach: since the backend uses the service role key (which bypasses RLS),
   we disable RLS on all tables. The backend enforces authorization in its controllers.

## Security
- RLS is disabled because the backend uses the service role key and enforces
  authorization at the controller level (JWT verification, ownership checks).
- The anon key is never used by the frontend (the frontend talks to the Express backend,
  which proxies to Supabase with the service role key).
- This is a server-side-only architecture: Frontend -> Express API -> Supabase DB.

## Important Notes
1. The users table now stores password hashes directly (bcrypt).
2. All FKs now reference the public.users table (self-referencing user identity).
3. companies.user_id, jobs.created_by, applications.applicant_id now reference users.id.
4. RLS is disabled on all 4 tables — the backend controller layer enforces authorization.
*/

-- Drop existing FKs that reference auth.users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_created_by_fkey;
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_applicant_id_fkey;

-- Add password column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password text NOT NULL DEFAULT '';

-- Change users.id to have its own default (no longer references auth.users)
-- The id column already defaults to nothing (it was a FK PK), so add a default
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Re-add FKs to reference public.users instead of auth.users
ALTER TABLE companies
    ADD CONSTRAINT companies_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE jobs
    ADD CONSTRAINT jobs_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE applications
    ADD CONSTRAINT applications_applicant_id_fkey
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE;

-- Disable RLS on all tables (backend uses service role key + controller-level auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies (no longer needed with RLS disabled)
DROP POLICY IF EXISTS "select_own_profile" ON users;
DROP POLICY IF EXISTS "insert_own_profile" ON users;
DROP POLICY IF EXISTS "update_own_profile" ON users;
DROP POLICY IF EXISTS "delete_own_profile" ON users;
DROP POLICY IF EXISTS "recruiters_view_applicants" ON users;

DROP POLICY IF EXISTS "select_companies" ON companies;
DROP POLICY IF EXISTS "insert_own_companies" ON companies;
DROP POLICY IF EXISTS "update_own_companies" ON companies;
DROP POLICY IF EXISTS "delete_own_companies" ON companies;

DROP POLICY IF EXISTS "select_jobs" ON jobs;
DROP POLICY IF EXISTS "insert_own_jobs" ON jobs;
DROP POLICY IF EXISTS "update_own_jobs" ON jobs;
DROP POLICY IF EXISTS "delete_own_jobs" ON jobs;

DROP POLICY IF EXISTS "select_applications" ON applications;
DROP POLICY IF EXISTS "insert_own_applications" ON applications;
DROP POLICY IF EXISTS "update_application_status" ON applications;
DROP POLICY IF EXISTS "delete_own_applications" ON applications;
