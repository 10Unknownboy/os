import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Music, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/love";
import MusicGallery from "./MusicGallery";
import HiddenMemories from "./HiddenMemories";
import AnalyticsDashboard from "./AnalyticsDashboard";

interface LoveWrappedProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const LoveWrapped = ({ customData }: LoveWrappedProps) => {
  const [demoData, setDemoData] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  // Load demo data only if no custom data
  useEffect(() => {
    if (customData) return;
    fetch("/data/analytics.json")
      .then((res) => res.json())
      .then((data) => setDemoData(data))
      .catch(() => setDemoData({
        analytics: { daysTogether: 730 },
        initials: { partner1: "A", partner2: "B" },
        quotes: ["Every love story is beautiful, but ours is my favorite. 💕"],
      }));
  }, [customData]);

  const data = customData ? {
    initials: { partner1: customData.project.initial_1 || "A", partner2: customData.project.initial_2 || "B" },
    analytics: customData.analytics,
    quotes: ["Every love story is beautiful, but ours is my favorite. 💕"],
    days: 730,
  } : demoData;

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart size={48} className="text-primary fill-primary" />
        </motion.div>
      </div>
    );
  }

  const initials = data.initials || { partner1: "A", partner2: "B" };
  const days = customData
    ? (data.analytics?.find((a: any) => a.title?.toLowerCase().includes("days"))?.value || 730)
    : (data.analytics?.daysTogether || 730);
  const quotes = data.quotes || [];

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Love Wrapped {currentYear}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your Love story: <span className="text-primary font-semibold">{days} days</span> of magic, laughter, and endless love 💕
        </p>
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-romantic flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-primary-foreground">{initials.partner1}</span>
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}>
            <Heart size={32} className="text-primary fill-primary animate-heart-beat" />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-sunset flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-primary-foreground">{initials.partner2}</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Music className="text-primary" />Memory Music Gallery</h2>
        <MusicGallery customData={customData} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <HiddenMemories customData={customData} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><TrendingUp className="text-primary" />Love Analytics</h2>
        <AnalyticsDashboard analytics={customData ? undefined : data.analytics} customTiles={customData ? data.analytics : undefined} />
      </motion.section>

      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center py-8">
        <GlassCard className="inline-block max-w-lg mx-auto">
          <p className="text-lg italic text-muted-foreground">"{quotes[0] || "Every love story is beautiful, but ours is my favorite. 💕"}"</p>
        </GlassCard>
      </motion.footer>
    </div>
  );
};

export default LoveWrapped;
