import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Play, Edit3, LogOut } from "lucide-react";
import { GlassCard, FloatingHearts, RomanticButton, ParticleBackground, AnimatedText } from "@/components/love";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "See you soon! 💕", description: "You've been logged out." });
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden relative">
      <ParticleBackground variant="mixed" density="low" />
      <FloatingHearts count={10} />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-love-lavender/10 rounded-full blur-3xl" />

      <motion.button
        onClick={handleLogout}
        className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-muted-foreground hover:text-foreground transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut size={18} />
        <span className="hidden md:inline">Logout</span>
      </motion.button>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-4xl z-10">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-romantic mb-6 glow-pink"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart size={48} className="text-primary-foreground fill-current" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <AnimatedText variant="gradient">Welcome to Love OS</AnimatedText>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {user?.email ? `Hello, ${user.user_metadata?.username || user.email.split("@")[0]}! ✨` : "Create unforgettable romantic experiences ✨"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div variants={itemVariants}>
            <GlassCard hover className="h-full min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer group" onClick={() => navigate("/loveos")}>
              <motion.div className="w-20 h-20 rounded-2xl bg-gradient-romantic flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" whileHover={{ rotate: 10 }}>
                <Play size={36} className="text-primary-foreground ml-1" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">View Demo</h2>
              <p className="text-muted-foreground mb-6 max-w-xs">Experience Love OS with sample data</p>
              <RomanticButton variant="secondary"><Play size={18} />Launch Demo</RomanticButton>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard hover className="h-full min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer group" onClick={() => navigate("/edit")}>
              <motion.div className="w-20 h-20 rounded-2xl bg-gradient-sunset flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" whileHover={{ rotate: -10 }}>
                <Edit3 size={36} className="text-primary-foreground" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">Create Your Own</h2>
              <p className="text-muted-foreground mb-6 max-w-xs">Customize every detail for your partner</p>
              <RomanticButton><Edit3 size={18} />Start Creating</RomanticButton>
            </GlassCard>
          </motion.div>
        </div>

        <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-10">
          Made with 💕 for the ones we love
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
