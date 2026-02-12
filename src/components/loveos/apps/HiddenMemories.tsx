import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/love";

interface HiddenMemoriesProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const HiddenMemories = ({ customData }: HiddenMemoriesProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // If customData, could load collage from storage
  const collageUrl = customData?.project?.collage_url;

  return (
    <div className="text-center">
      <motion.button onClick={() => setIsRevealed(true)} className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl hover:bg-accent/30 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-24 h-24 rounded-full bg-gradient-romantic flex items-center justify-center glow-pink">
          <Heart size={48} className="text-primary-foreground fill-current" />
        </motion.div>
        <div className="flex items-center gap-2 text-lg text-foreground">
          <Sparkles size={20} className="text-primary" /><span>Click to see our memories</span><Sparkles size={20} className="text-primary" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isRevealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setIsRevealed(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsRevealed(false)} className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-background glass-card flex items-center justify-center hover:bg-accent transition-colors">
                <X size={20} />
              </button>
              <GlassCard className="p-4">
                {collageUrl ? (
                  <img src={collageUrl} alt="Our memories" className="w-full rounded-xl" />
                ) : (
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-love-coral/10 flex items-center justify-center">
                    <div className="text-center">
                      <Heart size={64} className="text-primary/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">Your beautiful memories collage will appear here 💕</p>
                      <p className="text-sm text-muted-foreground mt-2">Upload your collage in the Creator Studio</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiddenMemories;
