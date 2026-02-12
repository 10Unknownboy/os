import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UploadState {
    fileName: string;
    progress: number;
    isUploading: boolean;
    error: string | null;
}

export function useUploadProgress() {
    const { user } = useAuth();
    const [uploadState, setUploadState] = useState<UploadState>({
        fileName: "",
        progress: 0,
        isUploading: false,
        error: null,
    });

    const uploadFile = useCallback(async (file: File, pathPrefix: "images" | "songs" | "auth") => {
        if (!user) {
            setUploadState(s => ({ ...s, error: "Not authenticated" }));
            return { data: null, error: new Error("Not authenticated") };
        }

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const fullPath = `${user.id}/${pathPrefix}/${filename}`;

        setUploadState({
            fileName: file.name,
            progress: 0,
            isUploading: true,
            error: null,
        });

        try {
            // We use Supabase SDK's upload with `onUploadProgress` if supported, 
            // otherwise fallback to XHR. Current supabase-js v2 supports onUploadProgress in some environments.
            // But for production resilience, we can use the XHR approach or Supabase's built-in if available.
            // Let's try the Supabase SDK approach first as it's cleaner.

            const { data, error } = await supabase.storage
                .from("loveos-uploads")
                .upload(fullPath, file, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type,
                    // Note: onUploadProgress is supported in newer @supabase/storage-js
                    // @ts-ignore
                    onUploadProgress: (progressEvent) => {
                        const percent = (progressEvent.loaded / progressEvent.total) * 100;
                        setUploadState(s => ({ ...s, progress: Math.round(percent) }));
                    },
                });

            if (error) throw error;

            // Completion delay for UI
            setTimeout(() => {
                setUploadState({ fileName: "", progress: 0, isUploading: false, error: null });
            }, 2000);

            const { data: { publicUrl } } = supabase.storage
                .from("loveos-uploads")
                .getPublicUrl(fullPath);

            return { data: { ...data, publicUrl }, error: null };
        } catch (err: any) {
            setUploadState(s => ({ ...s, isUploading: false, error: err.message }));
            return { data: null, error: err };
        }
    }, [user]);

    return { ...uploadState, uploadFile };
}
