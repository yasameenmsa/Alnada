/*
  # Add Media Support to Projects

  1. Changes
    - Add columns for main video and additional videos
    - Add columns for main file and additional files
    - Add validation checks for URLs and metadata
  
  2. Security
    - Maintain existing RLS policies
    - No changes to security model needed
*/

-- Add validation function for URL format
CREATE OR REPLACE FUNCTION is_valid_url(text) RETURNS boolean AS $$
BEGIN
  RETURN $1 ~* '^https?://[^\s/$.?#].[^\s]*$';
END;
$$ LANGUAGE plpgsql;

-- Add check constraints for URL fields
ALTER TABLE projects
ADD CONSTRAINT main_image_url_valid 
  CHECK (main_image->>'url' IS NULL OR is_valid_url(main_image->>'url')),
ADD CONSTRAINT main_video_url_valid 
  CHECK (main_video->>'url' IS NULL OR is_valid_url(main_video->>'url')),
ADD CONSTRAINT main_file_url_valid 
  CHECK (main_file->>'url' IS NULL OR is_valid_url(main_file->>'url'));

-- Add validation triggers for arrays of media
CREATE OR REPLACE FUNCTION validate_media_urls() RETURNS trigger AS $$
DECLARE
  url text;
  media json;
BEGIN
  -- Validate images array
  IF NEW.images IS NOT NULL THEN
    FOR media IN SELECT * FROM json_array_elements(NEW.images::json) LOOP
      url := media->>'url';
      IF url IS NOT NULL AND NOT is_valid_url(url) THEN
        RAISE EXCEPTION 'Invalid URL in images array: %', url;
      END IF;
    END LOOP;
  END IF;

  -- Validate videos array
  IF NEW.videos IS NOT NULL THEN
    FOR media IN SELECT * FROM json_array_elements(NEW.videos::json) LOOP
      url := media->>'url';
      IF url IS NOT NULL AND NOT is_valid_url(url) THEN
        RAISE EXCEPTION 'Invalid URL in videos array: %', url;
      END IF;
    END LOOP;
  END IF;

  -- Validate files array
  IF NEW.files IS NOT NULL THEN
    FOR media IN SELECT * FROM json_array_elements(NEW.files::json) LOOP
      url := media->>'url';
      IF url IS NOT NULL AND NOT is_valid_url(url) THEN
        RAISE EXCEPTION 'Invalid URL in files array: %', url;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_project_media_urls
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_media_urls();

-- Add helpful comments
COMMENT ON COLUMN projects.main_video IS 'Main project video with URL and metadata';
COMMENT ON COLUMN projects.videos IS 'Additional project videos with captions';
COMMENT ON COLUMN projects.main_file IS 'Main project document/file';
COMMENT ON COLUMN projects.files IS 'Additional project files with descriptions';