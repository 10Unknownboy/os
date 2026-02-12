import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Lock, Unlock, Loader2, AlertCircle } from "lucide-react";
import { useVoiceUnlock } from "@/hooks/useVoiceUnlock";
import { GlassCard } from "@/components/love/GlassCard";
import { RomanticButton } from "@/components/love/RomanticButton";

interface VoiceUnlockScreenProps {
    targetWord: string;
    onUnlocked: () => void;
}

export const VoiceUnlockScreen = ({ targetWord, onUnlocked }: VoiceUnlockScreenProps) => {
    const { isRecording, startListening, stopListening, setOnMatchSuccess, lastTranscript } = useVoiceUnlock(targetWord);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setOnMatchSuccess(() => {
            onUnlocked();
        });
    }, [onUnlocked, setOnMatchSuccess]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <GlassCard className="max-w-md w-full p-8 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <div className="flex justify-center">
                    <motion.div
                        animate={isRecording ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center ${isRecording ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'}`}
                    >
                        {isRecording ? <Mic size={32} /> : <Lock size={32} />}
                    </motion.div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">Voice Locked</h2>
                    <p className="text-sm text-muted-foreground">
                        Say the secret word to unlock your Love OS experience.
                    </p>
                </div>

                <div className="py-4">
                    <AnimatePresence mode="wait">
                        {isRecording ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center space-y-3"
                            >
                                <div className="flex gap-1 items-end h-8">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 bg-primary rounded-full"
                                            animate={{ height: [8, 24, 8] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium animate-pulse text-primary capitalize">Listening...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                <RomanticButton
                                    onClick={startListening}
                                    className="px-8 py-6 text-lg rounded-full group"
                                >
                                    <Mic className="mr-2 group-hover:scale-110 transition-transform" />
                                    Hold to Speak
                                </RomanticButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {lastTranscript && !isRecording && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-lg bg-accent/30 text-xs italic text-muted-foreground"
                    >
                        " {lastTranscript} "
                    </motion.div>
                )}

                <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                    <Unlock size={10} />
                    Secure Voice Token System
                </div>
            </GlassCard>
        </div>
    );
};
