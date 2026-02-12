import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, Lock, UserPlus, LogIn, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard, FloatingHearts, RomanticButton, AnimatedText } from "@/components/love";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // If already logged in, redirect
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast({ title: "Login failed 😢", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back! 💕", description: "Redirecting to your dashboard..." });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(regEmail, regPassword, regUsername);
    if (error) {
      toast({ title: "Registration failed 😢", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created! 🎉", description: "Check your email to verify your account." });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden relative">
      <FloatingHearts count={20} />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-love-coral/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8" variant="strong">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-romantic mb-4 glow-pink"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={40} className="text-primary-foreground fill-current" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              <AnimatedText variant="gradient">Love OS</AnimatedText>
            </h1>
            <p className="text-muted-foreground">
              Create a romantic experience for your special someone 💕
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-accent/50">
              <TabsTrigger value="login" className="gap-2"><LogIn size={16} />Login</TabsTrigger>
              <TabsTrigger value="register" className="gap-2"><UserPlus size={16} />Register</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login" className="mt-0">
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10 bg-background/50" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-password" type="password" placeholder="••••••••" className="pl-10 bg-background/50" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                    </div>
                  </div>
                  <RomanticButton type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Enter Love OS"}
                  </RomanticButton>
                </motion.form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-username" placeholder="lovebird" className="pl-10 bg-background/50" required value={regUsername} onChange={e => setRegUsername(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-10 bg-background/50" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-password" type="password" placeholder="••••••••" className="pl-10 bg-background/50" required minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="reg-confirm" type="password" placeholder="••••••••" className="pl-10 bg-background/50" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                    </div>
                  </div>
                  <RomanticButton type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account 💕"}
                  </RomanticButton>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Index;
