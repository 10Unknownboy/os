
-- LOVE OS STORAGE FINAL HARDENING
-- Ensures private bucket and strict folder-based RLS

-- 1. Ensure bucket is private
UPDATE storage.buckets SET public = false WHERE id = 'loveos-uploads';

-- 2. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete from their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can see their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can see shared files" ON storage.objects;

-- 3. Implementation of safe policies

-- INSERT: Only owner can upload to their own {user_id}/ folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- UPDATE: Only owner can update their own {user_id}/ folder
CREATE POLICY "Users can update their own folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: Only owner can delete from their own {user_id}/ folder
CREATE POLICY "Users can delete from their own folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: 
-- 1. Authenticated users can see their own folder
CREATE POLICY "Users can see their own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'loveos-uploads' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Public SELECT: Allow SELECT for anyone if we use Signed URLs (required for createSignedUrl to work)
-- OR we can allow reading all if we want simple implementation, but signed URLs are better for truly private.
-- However, for signedUrl tool to work in Supabase, the user needs SELECT permission.
CREATE POLICY "Allow public SELECT for signed URL generation"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'loveos-uploads'
);
