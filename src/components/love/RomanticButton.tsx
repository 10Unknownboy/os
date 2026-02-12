import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface RomanticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const RomanticButton = ({
  children,
  onClick,
  className,
  icon: Icon,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: RomanticButtonProps) => {
  const variants = {
    primary: "bg-gradient-romantic text-primary-foreground shadow-lg hover:shadow-xl",
    secondary: "glass-card text-foreground hover:bg-accent",
    ghost: "text-primary hover:bg-accent/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold",
        "transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={disabled ? {} : { y: -2, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {Icon && <Icon size={iconSizes[size]} />}
      {children}
    </motion.button>
  );
};

export default RomanticButton;
