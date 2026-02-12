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

        const resolveUrl = async () => {
            try {
                const { data, error } = await supabase.storage
                    .from("loveos-uploads")
                    .createSignedUrl(path, 3600);

                if (error) throw error;
                setUrl(data.signedUrl);
            } catch (err) {
                console.error("Error resolving signed URL:", err);
                const { data } = supabase.storage
                    .from("loveos-uploads")
                    .getPublicUrl(path);
                setUrl(data.publicUrl);
            } finally {
                setLoading(false);
            }
        };

        resolveUrl();
    }, [path]);

    return { url, loading };
}
