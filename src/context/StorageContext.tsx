import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UploadState {
    fileName: string;
    progress: number;
    isUploading: boolean;
    error: string | null;
}

interface StorageContextType extends UploadState {
    uploadFile: (file: File, pathPrefix: "images" | "songs" | "auth") => Promise<{ data: any; error: any }>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [state, setState] = useState<UploadState>({
        fileName: "",
        progress: 0,
        isUploading: false,
        error: null,
    });

    const uploadFile = useCallback(async (file: File, pathPrefix: "images" | "songs" | "auth") => {
        if (!user) {
            const err = new Error("Not authenticated");
            setState(s => ({ ...s, error: err.message }));
            return { data: null, error: err };
        }

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const fullPath = `${user.id}/${pathPrefix}/${filename}`;

        setState({
            fileName: file.name,
            progress: 0,
            isUploading: true,
            error: null,
        });

        try {
            const { data, error } = await supabase.storage
                .from("loveos-uploads")
                .upload(fullPath, file, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type,
                    // @ts-ignore
                    onUploadProgress: (progressEvent) => {
                        const percent = (progressEvent.loaded / progressEvent.total) * 100;
                        setState(s => ({ ...s, progress: Math.round(percent) }));
                    },
                });

            if (error) throw error;

            // Completion delay for UI
            setTimeout(() => {
                setState(s => ({ ...s, isUploading: false }));
            }, 2000);

            const { data: { publicUrl } } = supabase.storage
                .from("loveos-uploads")
                .getPublicUrl(fullPath);

            return { data: { ...data, publicUrl }, error: null };
        } catch (err: any) {
            setState(s => ({ ...s, isUploading: false, error: err.message }));
            return { data: null, error: err };
        }
    }, [user]);

    return (
        <StorageContext.Provider value={{ ...state, uploadFile }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
};
