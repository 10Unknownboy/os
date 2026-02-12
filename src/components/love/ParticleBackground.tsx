import { motion } from "framer-motion";
import { useMemo } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

interface ParticleBackgroundProps {
  variant?: "hearts" | "stars" | "mixed";
  density?: "low" | "medium" | "high";
  className?: string;
}

const ParticleBackground = ({
  variant = "mixed",
  density = "medium",
  className = "",
}: ParticleBackgroundProps) => {
  const counts = {
    low: 20,
    medium: 35,
    high: 50,
  };

  const particles = useMemo(() => {
    const count = counts[density];
    return Array.from({ length: count }, (_, i) => {
      const types = variant === "mixed" 
        ? ["heart", "star", "sparkle"][i % 3] 
        : variant === "hearts" 
        ? "heart" 
        : "star";
      
      return {
        id: i,
        type: types,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 12,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
        opacity: 0.05 + Math.random() * 0.15,
      };
    });
  }, [variant, density]);

  const getIcon = (type: string, size: number) => {
    switch (type) {
      case "heart":
        return <Heart size={size} className="fill-current" />;
      case "sparkle":
        return <Sparkles size={size} />;
      default:
        return <Star size={size} className="fill-current" />;
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-primary"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {getIcon(particle.type, particle.size)}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleBackground;
