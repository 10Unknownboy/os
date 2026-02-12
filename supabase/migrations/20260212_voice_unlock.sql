-- LOVE OS VOICE UNLOCK EXTENSION

-- 1. Add voice_file_path to loveos_projects
ALTER TABLE loveos_projects ADD COLUMN IF NOT EXISTS voice_file_path TEXT;

-- 2. Storage Policies for voice/ folder
-- Allow authenticated users to upload to their own voice folder
CREATE POLICY "Allow authenticated users to upload voice files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text AND
  (storage.foldername(name))[2] = 'voice'
);

-- Allow public read of voice files via signed URLs (already handled by bucket being private + signed URLs)
-- But we ensure we have a SELECT policy for authenticated owners as well
CREATE POLICY "Allow owners to select their own voice files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
