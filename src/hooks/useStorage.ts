import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";

export function useStorage() {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const uploadFile = useCallback(async (file: File, path: string) => {
        if (!user) return { data: null, error: new Error("Not authenticated") };

        setUploading(true);
        const fullPath = `${user.id}/${path}`;

        // Delete existing file if it exists to replace it
        await supabase.storage.from("loveos-uploads").remove([fullPath]);

        const { data, error } = await supabase.storage
            .from("loveos-uploads")
            .upload(fullPath, file, { upsert: true });

        setUploading(false);
        if (error) {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
            });
        }
        return { data, error };
    }, [user, toast]);

    const deleteFile = useCallback(async (path: string) => {
        if (!user) return { error: new Error("Not authenticated") };
        const fullPath = `${user.id}/${path}`;
        const { error } = await supabase.storage.from("loveos-uploads").remove([fullPath]);
        return { error };
    }, [user]);

    const getPublicUrl = useCallback((path: string) => {
        if (!user) return null;
        const fullPath = `${user.id}/${path}`;
        const { data } = supabase.storage.from("loveos-uploads").getPublicUrl(fullPath);
        return data.publicUrl;
    }, [user]);

    return { uploading, uploadFile, deleteFile, getPublicUrl };
}
