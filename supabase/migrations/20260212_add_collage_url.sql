-- Add collage_url column to loveos_projects table
ALTER TABLE loveos_projects ADD COLUMN IF NOT EXISTS collage_url TEXT;

-- Refresh the schema cache notation (Supabase does this automatically usually, but good for logs)
COMMENT ON COLUMN loveos_projects.collage_url IS 'URL for the memory collage image';
