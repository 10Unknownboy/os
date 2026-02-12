import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Heart, Volume2 } from "lucide-react";
import { FloatingHearts, AnimatedText } from "@/components/love";
import Desktop from "@/components/loveos/Desktop";
import "@/types/speech-recognition.d.ts";

interface LoveOSProps {
  customData?: {
    project: any;
    analytics: any[];
    quiz: any[];
    terminal: any[];
  };
  voiceWord?: string;
}

const LoveOS = ({ customData, voiceWord: propVoiceWord }: LoveOSProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const unlockWord = propVoiceWord || "open";

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition not supported. Click the heart to unlock!");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => { setIsListening(true); setError(""); };
    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex][0].transcript.toLowerCase();
      setTranscript(result);
      if (result.includes(unlockWord.toLowerCase())) {
        recognition.stop();
        setIsUnlocked(true);
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed") setError("Microphone access denied. Click the heart to unlock!");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  if (isUnlocked) {
    return <Desktop customData={customData} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden relative">
      <FloatingHearts count={25} />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-love-lavender/10 rounded-full blur-3xl animate-pulse" />
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
          <motion.button
            onClick={isListening ? undefined : startListening}
            onDoubleClick={() => setIsUnlocked(true)}
            className="relative mb-8 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center ${isListening ? "bg-gradient-romantic glow-pink" : "bg-gradient-romantic"}`}
              animate={isListening ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={64} className="text-primary-foreground fill-current" />
              {isListening && (
                <motion.div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background flex items-center justify-center" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                  <Mic size={16} className="text-primary" />
                </motion.div>
              )}
            </motion.div>
            {isListening && (
              <>
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary" animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary" animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
              </>
            )}
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <AnimatedText variant="gradient">{isListening ? "Listening..." : "Say the magic word"}</AnimatedText>
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {isListening ? "Speak clearly into your microphone" : "Tap the heart and speak to unlock"}
            </p>
            {transcript && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card inline-block px-4 py-2 mb-4">
                <span className="text-sm text-muted-foreground">Heard: </span>
                <span className="text-foreground font-medium">"{transcript}"</span>
              </motion.div>
            )}
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-love-rose mb-4">{error}</motion.p>}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Volume2 size={14} /><span>Hint: Say "{unlockWord}" to unlock</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Double-tap the heart to skip voice unlock</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoveOS;
