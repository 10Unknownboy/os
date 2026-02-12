import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, LucideIcon } from "lucide-react";
import { AppType } from "./Desktop";

interface TaskbarProps {
  apps: {
    id: AppType;
    name: string;
    icon: LucideIcon;
    color: string;
  }[];
  openApp: AppType;
  onOpenApp: (appId: AppType) => void;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

const Taskbar = ({
  apps,
  openApp,
  onOpenApp,
  startMenuOpen,
  onToggleStartMenu,
}: TaskbarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="h-14 md:h-16 glass-card-strong border-t border-border/30 flex items-center px-4 relative z-50"
    >
      {/* Start Button */}
      <motion.button
        onClick={onToggleStartMenu}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors ${
          startMenuOpen ? "bg-primary/20" : "hover:bg-accent/50"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Heart 
            size={24} 
            className="text-primary fill-primary" 
          />
        </motion.div>
      </motion.button>

      {/* Center - App Icons */}
      <div className="flex-1 flex items-center justify-center gap-2 md:gap-4">
        {apps.map((app) => (
          <motion.button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${
              openApp === app.id 
                ? "bg-accent/70 ring-2 ring-primary/50" 
                : "hover:bg-accent/50"
            }`}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <app.icon 
              size={20} 
              className={openApp === app.id ? "text-primary" : "text-muted-foreground"} 
            />
            {/* Active indicator */}
            {openApp === app.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-1 w-4 h-1 rounded-full bg-primary"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Right - Clock */}
      <div className="text-right">
        <div className="text-sm font-medium text-foreground">{formatTime(time)}</div>
        <div className="text-xs text-muted-foreground">{formatDate(time)}</div>
      </div>
    </motion.div>
  );
};

export default Taskbar;
