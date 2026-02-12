import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
    fileName: string;
    progress: number;
    isUploading: boolean;
    error: string | null;
}

export const UploadProgress = ({ fileName, progress, isUploading, error }: UploadProgressProps) => {
    return (
        <AnimatePresence>
            {(isUploading || error) && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[100] w-72"
                >
                    <GlassCard className="p-4 shadow-2xl border-primary/20 backdrop-blur-xl bg-background/80">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${error ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                {error ? (
                                    <AlertCircle size={18} />
                                ) : progress === 100 ? (
                                    <CheckCircle2 size={18} className="text-green-500" />
                                ) : (
                                    <Loader2 size={18} className="animate-spin" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                    {error ? "Upload Failed" : progress === 100 ? "Upload Complete" : "Uploading File"}
                                </p>
                                <p className="text-sm font-medium truncate">{fileName}</p>
                            </div>
                        </div>

                        {!error && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-1.5" />
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                    <span>{progress}%</span>
                                    <span>{progress === 100 ? "Processing..." : "Remaining..."}</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-[10px] text-destructive font-medium bg-destructive/5 p-2 rounded border border-destructive/10">
                                {error}
                            </p>
                        )}
                    </GlassCard>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
