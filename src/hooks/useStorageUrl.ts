import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves a storage path to a usable URL.
 * Automatically handles public URLs for now, but can be updated to use signed URLs.
 */
export function useStorageUrl(path: string | null | undefined) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!path) {
            setUrl(null);
            return;
        }

        // If it's already a full URL (legacy data), just use it
        if (path.startsWith("http")) {
            setUrl(path);
            return;
        }

        setLoading(true);

        // For now we use getPublicUrl. 
        // If the bucket is strictly private and we need signed URLs, 
        // we would use createSignedUrl here.
        const { data } = supabase.storage
            .from("loveos-uploads")
            .getPublicUrl(path);

        setUrl(data.publicUrl);
        setLoading(false);
    }, [path]);

    return { url, loading };
}
