import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
}

const GlassCard = ({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}: GlassCardProps) => {
  const variants = {
    default: "glass-card",
    strong: "glass-card-strong",
    subtle: "glass-card opacity-80",
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        "p-6",
        hover && "transition-transform hover:scale-[1.02] cursor-pointer",
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
