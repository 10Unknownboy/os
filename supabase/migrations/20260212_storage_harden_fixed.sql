
-- LOVE OS STORAGE HARDENED (FIXED PERMISSIONS)
-- This version removes the CREATE INDEX on storage.objects which caused the permission error.

-- 1. Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'loveos-uploads', 'loveos-uploads', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'loveos-uploads'
);

-- 2. Clean up existing policies for this bucket
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete from their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can see their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can see shared files" ON storage.objects;

-- 3. Strict Folder-Based policies
-- Path structure: {user_id}/images/{filename}, {user_id}/songs/{filename}

-- INSERT: Only owner can upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- UPDATE: Only owner can update their own folder
CREATE POLICY "Users can update their own folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: Only owner can delete from their own folder
CREATE POLICY "Users can delete from their own folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: Owners can see their own files
CREATE POLICY "Users can see their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: Public can see shared files
-- Note: This requires the object to be in the 'loveos-uploads' bucket.
CREATE POLICY "Public can see shared files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'loveos-uploads'
);
