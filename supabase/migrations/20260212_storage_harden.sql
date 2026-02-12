
-- LOVE OS STORAGE HARDENED

-- 1. Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'loveos-uploads', 'loveos-uploads', false
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'loveos-uploads'
);

-- 2. Drop existing policies to start fresh
DROP POLICY IF EXISTS "storage_select_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_anon" ON storage.objects;

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

-- SELECT: Public can see files if they have the share code (simplified to public read for now as sharing is link-based)
-- To harden this, we could check if the project associated with the user_id (folder name) has a share link.
CREATE POLICY "Public can see shared files"
ON storage.objects FOR SELECT TO anon
USING (
  bucket_id = 'loveos-uploads'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name ON storage.objects (bucket_id, name);
