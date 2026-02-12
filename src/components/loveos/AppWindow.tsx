import { motion } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";

interface AppWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isMobile: boolean;
}

const AppWindow = ({ title, children, onClose, isMobile }: AppWindowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`absolute inset-0 ${isMobile ? "" : "m-4 md:m-8"} glass-card-strong rounded-2xl overflow-hidden flex flex-col`}
    >
      {/* Window Header */}
      <div className="h-12 md:h-14 flex items-center justify-between px-4 border-b border-border/30 bg-background/30">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors text-muted-foreground"
            onClick={() => {}}
          >
            <Minus size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors text-muted-foreground"
            onClick={() => {}}
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto scrollbar-romantic">
        {children}
      </div>
    </motion.div>
  );
};

export default AppWindow;
