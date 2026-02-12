import { useState, useCallback, useRef } from "react";
import { useToast } from "./use-toast";

export function useVoiceUnlock(targetWord: string) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastTranscript, setLastTranscript] = useState("");
    const { toast } = useToast();

    // We use a ref for the recognition object because it shouldn't trigger re-renders
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast({
                title: "Not Supported",
                description: "Voice recognition is not supported in this browser.",
                variant: "destructive"
            });
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
            toast({
                title: "Try Again",
                description: "Couldn't quite hear you. Please try again.",
                variant: "destructive"
            });
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            setLastTranscript(transcript);

            const matches = transcript.includes(targetWord.toLowerCase().trim());

            if (matches) {
                toast({
                    title: "Access Granted",
                    description: "Voice matched! Unlocking Love OS...",
                });
                // We'll return the result to the caller
                onMatchSuccess();
            } else {
                toast({
                    title: "Access Denied",
                    description: `You said "${transcript}", but that's not the secret word.`,
                    variant: "destructive"
                });
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    }, [targetWord, toast]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    // Placeholder for success callback
    let onMatchSuccess = () => { };

    const setOnMatchSuccess = (fn: () => void) => {
        onMatchSuccess = fn;
    };

    return {
        isRecording,
        isProcessing,
        lastTranscript,
        startListening,
        stopListening,
        setOnMatchSuccess
    };
}
