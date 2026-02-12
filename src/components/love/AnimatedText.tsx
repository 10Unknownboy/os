import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  variant?: "fade" | "slide" | "typewriter" | "gradient";
}

const AnimatedText = ({
  children,
  className,
  delay = 0,
  variant = "fade",
}: AnimatedTextProps) => {
  if (variant === "typewriter") {
    const letters = children.split("");
    return (
      <span className={className}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + i * 0.05 }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
    );
  }

  if (variant === "gradient") {
    return (
      <motion.span
        className={cn("text-gradient", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.span>
    );
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  };

  return (
    <motion.span
      className={className}
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedText;
