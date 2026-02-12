import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useShare } from "@/hooks/useShare";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useQuiz } from "@/hooks/useQuiz";
import { useTerminal } from "@/hooks/useTerminal";
import { GlassCard, RomanticButton, FloatingHearts } from "@/components/love";
import { VoiceUnlockScreen } from "@/components/loveos/VoiceUnlockScreen";
import Desktop from "@/components/loveos/Desktop";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SharedLoveOS = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateShare } = useShare();
  const { getAnalytics } = useAnalytics();
  const { getQuiz } = useQuiz();
  const { getCommands } = useTerminal();

  const [code, setCode] = useState(searchParams.get("c") || "");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);

  const handleUnlock = async () => {
    if (!code) return;
    setLoading(true);

    try {
      const projectId = await validateShare(code);
      if (!projectId) {
        toast({
          title: "Invalid Code",
          description: "That code doesn't seem to work. Try again? 💕",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Fetch all project data
      const [projectRes, analyticsRes, quizRes, terminalRes] = await Promise.all([
        supabase.from("loveos_projects").select("*").eq("id", projectId).single(),
        getAnalytics(projectId),
        getQuiz(projectId),
        getCommands(projectId),
      ]);

      if (projectRes.error) throw projectRes.error;

      setProjectData({
        project: projectRes.data,
        analytics: analyticsRes,
        quiz: quizRes,
        terminal: terminalRes,
      });

      setIsUnlocked(true);
      toast({
        title: "Access Granted! 💖",
        description: "Welcome to your personalized Love OS.",
      });
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-attempt if code is in URL? Maybe not for security, but let's allow it if user provided it
  useEffect(() => {
    const urlCode = searchParams.get("c");
    if (urlCode) setCode(urlCode);
  }, [searchParams]);

  const [voiceUnlocked, setVoiceUnlocked] = useState(false);

  const needsVoiceUnlock = projectData?.project?.voice_word && projectData?.project?.voice_file_path;

  if (isUnlocked && projectData) {
    if (needsVoiceUnlock && !voiceUnlocked) {
      return (
        <VoiceUnlockScreen
          targetWord={projectData.project.voice_word}
          onUnlocked={() => setVoiceUnlocked(true)}
        />
      );
    }

    return (
      <Desktop
        customData={{
          project: projectData.project,
          analytics: projectData.analytics,
          quiz: projectData.quiz,
          terminal: projectData.terminal
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-red-50 relative overflow-hidden">
      <FloatingHearts count={12} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8 backdrop-blur-2xl border-white/40 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner"
            >
              <Lock size={32} />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gradient">Personal Love OS</h1>
              <p className="text-muted-foreground">Enter your unique access code to unlock your personalized gift.</p>
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="E.g. LOVE-2024"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="h-14 text-center text-xl font-bold tracking-[0.2em] bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all uppercase"
                />
              </div>

              <RomanticButton
                onClick={handleUnlock}
                disabled={!code || loading}
                className="w-full h-14 text-lg group"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    Unlock My Gift <Heart size={18} className="ml-2 group-hover:scale-125 transition-transform" fill="currentColor" />
                  </>
                )}
              </RomanticButton>
            </div>

            <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
              Only for your eyes • Secured with SHA-256
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-sm text-pink-400 font-medium">Made with Love OS</p>
      </motion.div>
    </div>
  );
};

export default SharedLoveOS;
