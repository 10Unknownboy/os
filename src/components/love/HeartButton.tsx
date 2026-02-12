import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  spinning?: boolean;
  pulsing?: boolean;
  children?: React.ReactNode;
}

const HeartButton = ({
  onClick,
  className,
  size = "md",
  spinning = false,
  pulsing = false,
  children,
}: HeartButtonProps) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "bg-gradient-romantic text-primary-foreground",
        "shadow-lg hover:shadow-xl transition-shadow",
        "glow-pink",
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={spinning ? { rotate: 360 } : pulsing ? { scale: [1, 1.1, 1] } : {}}
        transition={
          spinning
            ? { duration: 8, repeat: Infinity, ease: "linear" }
            : pulsing
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        <Heart size={iconSizes[size]} className="fill-current" />
      </motion.div>
      {children}
    </motion.button>
  );
};

export default HeartButton;
