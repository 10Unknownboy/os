import React from "react";
import { useStorageUrl } from "@/hooks/useStorageUrl";
import { Loader2 } from "lucide-react";

interface StorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    path: string | null | undefined;
    placeholder?: string;
}

export const StorageImage = ({ path, placeholder = "/placeholder.svg", ...props }: StorageImageProps) => {
    const { url, loading } = useStorageUrl(path);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-accent/20">
                <Loader2 className="animate-spin text-primary opacity-50" size={24} />
            </div>
        );
    }

    return <img src={url || placeholder} {...props} />;
};
