import { motion } from "framer-motion";
import { Calendar, MapPin, MessageCircle, Phone, Heart, Music, Clock, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/love";
import { Progress } from "@/components/ui/progress";

interface AnalyticsProps {
  analytics?: {
    daysTogether: number;
    relationshipStarted: string;
    firstDate: string;
    firstKiss: string;
    firstHug: string;
    bestDay: string;
    mostUsedWord: string;
    totalMessages: number;
    herWords: number;
    hisWords: number;
    reelsShared: number;
    loveCount: number;
    iLoveYouCount: number;
    busiestDay: string;
    longestCall: number;
    totalCalls: number;
    emojisSent: number;
    topSong: string;
  };
  customTiles?: any[];
}

const iconMap: Record<string, any> = {
  heart: Heart, calendar: Calendar, "map-pin": MapPin, "message-circle": MessageCircle,
  phone: Phone, music: Music, clock: Clock, "trending-up": TrendingUp,
};

const AnalyticsDashboard = ({ analytics, customTiles }: AnalyticsProps) => {
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
    catch { return dateStr; }
  };

  // If customTiles provided (from DB), use those
  if (customTiles && customTiles.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {customTiles.map((tile: any, index: number) => {
          const Icon = iconMap[tile.icon] || Heart;
          return (
            <motion.div key={tile.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <GlassCard variant="subtle" className="p-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="text-primary"><Icon size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 truncate">{tile.title}</p>
                    {tile.type === "counter" && <motion.p className="text-xl font-bold text-foreground">{formatNumber(Number(tile.value) || 0)}</motion.p>}
                    {tile.type === "date" && <p className="text-sm font-medium text-foreground">{formatDate(tile.value)}</p>}
                    {tile.type === "text" && <p className="text-sm font-medium text-foreground truncate">{tile.value}</p>}
                    {tile.type === "progress" && (
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-foreground">{formatNumber(Number(tile.value) || 0)}</p>
                        <Progress value={((Number(tile.value) || 0) / (tile.max_value || 1)) * 100} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default demo stats
  const stats = [
    { label: "Days Together", value: analytics?.daysTogether || 730, type: "counter", icon: Heart, color: "text-primary" },
    { label: "Relationship Started", value: analytics?.relationshipStarted || "2023-02-14", type: "date", icon: Calendar, color: "text-love-coral" },
    { label: "First Date", value: analytics?.firstDate || "2023-02-10", type: "date", icon: Calendar, color: "text-love-lavender" },
    { label: "First Kiss", value: analytics?.firstKiss || "That magical rooftop", type: "text", icon: MapPin, color: "text-primary" },
    { label: "First Hug", value: analytics?.firstHug || "Outside the coffee shop", type: "text", icon: MapPin, color: "text-love-coral" },
    { label: "Best Day", value: analytics?.bestDay || "2024-02-14", type: "date", icon: Calendar, color: "text-love-lavender" },
    { label: "Most Used Word", value: analytics?.mostUsedWord || "Love", type: "text", icon: MessageCircle, color: "text-primary" },
    { label: "Total Messages", value: analytics?.totalMessages || 523847, max: 700000, type: "progress", icon: MessageCircle, color: "text-love-coral" },
    { label: "Her Words", value: analytics?.herWords || 35420, max: 40000, type: "progress", icon: MessageCircle, color: "text-love-lavender" },
    { label: "His Words", value: analytics?.hisWords || 32150, max: 40000, type: "progress", icon: MessageCircle, color: "text-primary" },
    { label: "Reels Shared", value: analytics?.reelsShared || 12543, max: 20000, type: "progress", icon: TrendingUp, color: "text-love-coral" },
    { label: "Love Count", value: analytics?.loveCount || 8976, max: 15000, type: "progress", icon: Heart, color: "text-love-lavender" },
    { label: "I Love You Count", value: analytics?.iLoveYouCount || 4521, type: "counter", icon: Heart, color: "text-primary" },
    { label: "Busiest Day", value: analytics?.busiestDay || "Valentine's Day", type: "text", icon: Calendar, color: "text-love-coral" },
    { label: "Longest Call (mins)", value: analytics?.longestCall || 487, type: "counter", icon: Phone, color: "text-love-lavender" },
    { label: "Total Calls", value: analytics?.totalCalls || 342, max: 500, type: "progress", icon: Phone, color: "text-primary" },
    { label: "Emojis Sent", value: analytics?.emojisSent || 3847, max: 5000, type: "progress", icon: Heart, color: "text-love-coral" },
    { label: "Top Song", value: analytics?.topSong || "Perfect - Ed Sheeran", type: "text", icon: Music, color: "text-love-lavender" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
          <GlassCard variant="subtle" className="p-4 h-full">
            <div className="flex items-start gap-3">
              <div className={stat.color}><stat.icon size={20} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 truncate">{stat.label}</p>
                {stat.type === "counter" && <motion.p className="text-xl font-bold text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 + 0.2 }}>{formatNumber(stat.value as number)}</motion.p>}
                {stat.type === "date" && <p className="text-sm font-medium text-foreground">{formatDate(stat.value as string)}</p>}
                {stat.type === "text" && <p className="text-sm font-medium text-foreground truncate">{stat.value}</p>}
                {stat.type === "progress" && (
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">{formatNumber(stat.value as number)}</p>
                    <Progress value={((stat.value as number) / ((stat as any).max || 1)) * 100} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;
