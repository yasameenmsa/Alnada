/*
  # Add missing project fields

  1. New Fields
    - `main_video` (JSONB) - Main project video information
    - `videos` (JSONB) - Additional project videos
    - `main_file` (JSONB) - Main project document/file
    - `files` (JSONB) - Additional project files
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns for videos and files
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS main_video JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS main_file JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]'::jsonb;

-- Add comments for new columns
COMMENT ON COLUMN projects.main_video IS 'Main project video information including URL and metadata';
COMMENT ON COLUMN projects.videos IS 'Additional project videos with captions and metadata';
COMMENT ON COLUMN projects.main_file IS 'Main project document/file information';
COMMENT ON COLUMN projects.files IS 'Additional project files with descriptions and metadata';