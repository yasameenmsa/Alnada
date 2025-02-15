/*
  # Projects Schema Update

  1. New Structure
    - Enhanced project details with bilingual support (Arabic/English)
    - Dynamic storage for objectives, achievements, and beneficiaries
    - Improved location and funding source tracking
    - Detailed budget and phase tracking
    - Enhanced image management with metadata
    
  2. Key Changes
    - All text fields have Arabic/English versions
    - JSONB fields for dynamic data storage
    - Strict status validation
    - Comprehensive project phase tracking
    - Detailed beneficiary breakdown
    
  3. Security
    - RLS policies maintained
    - Default timestamps for auditing
*/

-- Drop existing projects table if exists
DROP TABLE IF EXISTS projects;

-- Create new projects table with updated schema
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information (Bilingual)
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    
    -- Project Goals and Achievements (Bilingual)
    objectives_ar JSONB NOT NULL DEFAULT '[]'::jsonb, 
    objectives_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Beneficiaries Information (Bilingual)
    beneficiaries_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
    beneficiaries_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Duration Information (Bilingual)
    duration_ar TEXT NOT NULL,
    duration_en TEXT NOT NULL,
    
    -- Locations (Multiple)
    locations JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Project Timeline
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Budget Information
    budget JSONB DEFAULT '{}'::jsonb,
    
    -- Funding Sources (Bilingual)
    funding_source_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
    funding_source_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Project Status
    status TEXT NOT NULL CHECK (status IN ('Ongoing', 'Completed', 'Planned')),
    
    -- Project Phases
    project_phases JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Images
    main_image JSONB NOT NULL DEFAULT '{}'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Beneficiaries Breakdown
    beneficiaries_breakdown JSONB NOT NULL DEFAULT '{
        "total": 0,
        "women": 0,
        "men": 0,
        "children": 0,
        "elderly": 0,
        "disabled": 0
    }'::jsonb,
    
    -- Metadata
    published BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT
    USING (published = true);

CREATE POLICY "Users can manage their own projects" ON projects
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX projects_status_idx ON projects(status);
CREATE INDEX projects_published_idx ON projects(published);
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_start_date_idx ON projects(start_date);
CREATE INDEX projects_end_date_idx ON projects(end_date);

-- Add helpful comments
COMMENT ON TABLE projects IS 'Stores project information with bilingual support and detailed tracking';
COMMENT ON COLUMN projects.objectives_ar IS 'Project objectives in Arabic, stored as JSONB array';
COMMENT ON COLUMN projects.objectives_en IS 'Project objectives in English, stored as JSONB array';
COMMENT ON COLUMN projects.locations IS 'Multiple project locations with coordinates and metadata';
COMMENT ON COLUMN projects.project_phases IS 'Project phases with dates, milestones, and status';
COMMENT ON COLUMN projects.beneficiaries_breakdown IS 'Detailed breakdown of project beneficiaries by category';