import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useMemo } from "react";

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

const FloatingHearts = ({ count = 15, className = "" }: FloatingHeartsProps) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
      size: 12 + Math.random() * 16,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: "-50px",
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(heart.id) * 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Heart
            size={heart.size}
            className="text-primary fill-primary"
            style={{ opacity: heart.opacity }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
