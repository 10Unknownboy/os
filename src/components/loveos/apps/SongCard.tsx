import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";
import { useStorageUrl } from "@/hooks/useStorageUrl";
import { StorageImage } from "@/components/love/StorageImage";

interface SongCardProps {
    song: any;
    isFlipped: boolean;
    isPlaying: boolean;
    onClick: (id: number) => void;
    onAudioReady: (url: string) => void;
}

export const SongCard = ({ song, isFlipped, isPlaying, onClick, onAudioReady }: SongCardProps) => {
    const { url: audioUrl } = useStorageUrl(song.audio);

    useEffect(() => {
        if (audioUrl) {
            onAudioReady(audioUrl);
        }
    }, [audioUrl, onAudioReady]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-square perspective-1000"
        >
            <motion.div
                className="relative w-full h-full cursor-pointer"
                onClick={() => onClick(song.id)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden glass-card" style={{ backfaceVisibility: "hidden" }}>
                    <StorageImage
                        path={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        placeholder="/placeholder.svg"
                    />
                </div>

                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden glass-card-strong p-4 flex flex-col items-center justify-center text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <motion.div
                        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center mb-4"
                    >
                        {isPlaying ? <Pause size={28} className="text-primary-foreground" /> : <Play size={28} className="text-primary-foreground ml-1" />}
                    </motion.div>

                    <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-1">{song.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">{song.artist}</p>

                    {isPlaying && (
                        <div className="flex items-end justify-center gap-1 mt-4 h-6">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-primary rounded-full"
                                    animate={{ height: [8, 24, 8] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
