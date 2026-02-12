import { useState, useCallback, useRef } from "react";
import { useStorage } from "@/context/StorageContext";

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const { uploadFile } = useStorage();

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const uploadVoice = useCallback(async () => {
        if (!audioBlob) return null;

        const file = new File([audioBlob], `voice-unlock-${Date.now()}.webm`, { type: 'audio/webm' });
        const { data, error } = await uploadFile(file, "voice");

        if (error) {
            console.error("Error uploading voice file:", error);
            return null;
        }

        return data.path;
    }, [audioBlob, uploadFile]);

    const resetRecording = useCallback(() => {
        setAudioUrl(null);
        setAudioBlob(null);
    }, []);

    return {
        isRecording,
        audioUrl,
        startRecording,
        stopRecording,
        uploadVoice,
        resetRecording
    };
}
