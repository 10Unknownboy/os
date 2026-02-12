import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Share2, Check, Copy, Music, Image as ImageIcon, BarChart, HelpCircle, Terminal, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard, FloatingHearts, RomanticButton } from "@/components/love";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { useAnalytics, AnalyticsItem } from "@/hooks/useAnalytics";
import { useQuiz, QuizQuestion } from "@/hooks/useQuiz";
import { useTerminal, TerminalCommand } from "@/hooks/useTerminal";
import { useShare } from "@/hooks/useShare";
import { useStorage } from "@/context/StorageContext";
import { StorageImage } from "@/components/love/StorageImage";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Edit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { project, loading: projectLoading, updateProject } = useProject();
  const { getAnalytics, upsertAnalytics, loading: analyticsLoading } = useAnalytics();
  const { getQuiz, upsertQuiz, loading: quizLoading } = useQuiz();
  const { getCommands, upsertCommands, loading: terminalLoading } = useTerminal();
  const { generateShare } = useShare();
  const { uploadFile } = useStorage();

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Local state for edits
  const [localProject, setLocalProject] = useState<any>(null);
  const [localAnalytics, setLocalAnalytics] = useState<AnalyticsItem[]>([]);
  const [localQuiz, setLocalQuiz] = useState<QuizQuestion[]>([]);
  const [localTerminal, setLocalTerminal] = useState<TerminalCommand[]>([]);

  useEffect(() => {
    if (project) {
      setLocalProject(project);
      fetchRelatedData(project.id);
    }
  }, [project]);

  const fetchRelatedData = async (projectId: string) => {
    const [analytics, quiz, terminal] = await Promise.all([
      getAnalytics(projectId),
      getQuiz(projectId),
      getCommands(projectId),
    ]);
    setLocalAnalytics(analytics);
    setLocalQuiz(quiz);
    setLocalTerminal(terminal);
  };

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);

    try {
      // 1. Update project metadata
      const { error: projectError } = await updateProject({
        initial_1: localProject.initial_1,
        initial_2: localProject.initial_2,
        partner_name: localProject.partner_name,
        songs_meta: localProject.songs_meta,
        collage_url: localProject.collage_url,
      });

      if (projectError) throw projectError;

      // 2. Update analytics
      const { error: analyticsError } = await upsertAnalytics(localAnalytics);
      if (analyticsError) throw analyticsError;

      // 3. Update quiz
      const { error: quizError } = await upsertQuiz(localQuiz);
      if (quizError) throw quizError;

      // 4. Update terminal
      const { error: terminalError } = await upsertCommands(localTerminal);
      if (terminalError) throw terminalError;

      toast({
        title: "Changes saved! 💕",
        description: "Your Love OS has been updated.",
      });

      // Generate share code if not already generated or if user wants a new one
      const code = await generateShare(project.id);
      if (code) {
        setShareCode(code);
        setShowShareDialog(true);
      }
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/loveos/code?c=${shareCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied! 📋",
      description: "Share it with your special someone!",
    });
  };

  if (projectLoading || !localProject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary mb-4"
        >
          <Heart size={48} fill="currentColor" />
        </motion.div>
        <p className="text-xl font-medium animate-pulse">Loading your Love OS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background via-accent/10 to-background relative overflow-x-hidden">
      <FloatingHearts count={10} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8 sticky top-0 z-10 p-2"
      >
        <GlassCard className="flex items-center justify-between p-4 backdrop-blur-xl border-white/20">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          <div className="flex gap-3">
            <RomanticButton
              variant="secondary"
              onClick={() => shareCode ? setShowShareDialog(true) : handleSave()}
              disabled={saving}
            >
              <Share2 size={18} />
              {shareCode ? "Share" : "Generate Link"}
            </RomanticButton>
            <RomanticButton onClick={handleSave} disabled={saving || analyticsLoading || quizLoading || terminalLoading}>
              <Save size={18} className={saving ? "animate-spin" : ""} />
              {saving ? "Saving..." : "Save Changes"}
            </RomanticButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto pb-20"
      >
        <GlassCard className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
              Creator Studio <Heart className="text-primary" size={20} fill="currentColor" />
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Design a workspace as unique as your love.</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <div className="px-6 py-2 bg-accent/20">
              <TabsList className="flex w-full overflow-x-auto justify-start md:justify-center h-auto p-1 bg-transparent gap-1 no-scrollbar">
                <TabsTrigger value="general" className="gap-2 px-4 py-2"><Heart size={14} /> General</TabsTrigger>
                <TabsTrigger value="music" className="gap-2 px-4 py-2"><Music size={14} /> Music</TabsTrigger>
                <TabsTrigger value="collage" className="gap-2 px-4 py-2"><ImageIcon size={14} /> Collage</TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2 px-4 py-2"><BarChart size={14} /> Analytics</TabsTrigger>
                <TabsTrigger value="quiz" className="gap-2 px-4 py-2"><HelpCircle size={14} /> Quiz</TabsTrigger>
                <TabsTrigger value="terminal" className="gap-2 px-4 py-2"><Terminal size={14} /> Terminal</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* General Tab */}
              <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="partnerName" className="text-lg font-semibold">Partner's Name</Label>
                    <Input
                      id="partnerName"
                      placeholder="Enter their name"
                      value={localProject.partner_name}
                      onChange={(e) => setLocalProject({ ...localProject, partner_name: e.target.value })}
                      className="bg-background/50 h-12 text-lg focus:ring-primary/20"
                    />
                    <p className="text-sm text-muted-foreground italic">How should I address your special person?</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/30">
                  <h3 className="text-lg font-semibold mb-6">User Initials</h3>
                  <div className="flex items-center gap-8 justify-center">
                    <div className="space-y-3 text-center">
                      <Label htmlFor="initial1" className="text-xs uppercase tracking-widest text-muted-foreground">Yours</Label>
                      <Input
                        id="initial1"
                        maxLength={1}
                        value={localProject.initial_1}
                        onChange={(e) => setLocalProject({ ...localProject, initial_1: e.target.value.toUpperCase() })}
                        className="bg-background/50 text-center text-4xl font-bold w-24 h-24 rounded-full border-2 border-primary/20 focus:border-primary transition-all shadow-lg"
                      />
                    </div>

                    <div className="text-primary animate-pulse pt-6">
                      <Heart size={32} fill="currentColor" />
                    </div>

                    <div className="space-y-3 text-center">
                      <Label htmlFor="initial2" className="text-xs uppercase tracking-widest text-muted-foreground">Theirs</Label>
                      <Input
                        id="initial2"
                        maxLength={1}
                        value={localProject.initial_2}
                        onChange={(e) => setLocalProject({ ...localProject, initial_2: e.target.value.toUpperCase() })}
                        className="bg-background/50 text-center text-4xl font-bold w-24 h-24 rounded-full border-2 border-primary/20 focus:border-primary transition-all shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Music Tab */}
              <TabsContent value="music" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Music Gallery</h3>
                    <p className="text-sm text-muted-foreground">Add up to 6 songs that will appear in the Love Wrapped experience.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const song = localProject.songs_meta[i] || { title: "", artist: "", image_path: "", audio_path: "" };
                    return (
                      <GlassCard key={i} variant="subtle" className="p-4 space-y-4 border-white/10 group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Track {i + 1}</span>
                          <Music size={14} className="text-primary opacity-50" />
                        </div>

                        <div className="space-y-4">
                          {/* Image Upload */}
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-accent/20 border-2 border-dashed border-white/10 group-hover:border-primary/20 transition-all">
                            {song.image_path ? (
                              <StorageImage path={song.image_path} alt="Song cover" className="w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon size={24} className="mb-2 opacity-50" />
                                <span className="text-[10px] text-center px-4">Click to upload cover</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast({
                                      title: "Image too large",
                                      description: "Max 5MB for song covers",
                                      variant: "destructive"
                                    });
                                    return;
                                  }
                                  const { data } = await uploadFile(file, "images");
                                  if (data) {
                                    const newSongs = [...localProject.songs_meta];
                                    newSongs[i] = { ...song, image_path: data.path };
                                    setLocalProject({ ...localProject, songs_meta: newSongs });
                                    toast({ title: "Cover uploaded! 🎨" });
                                  }
                                }
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Input
                              placeholder="Song title"
                              value={song.title}
                              onChange={(e) => {
                                const newSongs = [...localProject.songs_meta];
                                newSongs[i] = { ...song, title: e.target.value };
                                setLocalProject({ ...localProject, songs_meta: newSongs });
                              }}
                              className="bg-background/30 h-9 text-sm"
                            />
                            <Input
                              placeholder="Artist name"
                              value={song.artist}
                              onChange={(e) => {
                                const newSongs = [...localProject.songs_meta];
                                newSongs[i] = { ...song, artist: e.target.value };
                                setLocalProject({ ...localProject, songs_meta: newSongs });
                              }}
                              className="bg-background/30 h-9 text-sm"
                            />
                          </div>

                          {/* Audio Upload */}
                          <div className="relative h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center px-3 gap-2 group/audio overflow-hidden">
                            <Music size={14} className="text-primary" />
                            <span className="text-[10px] font-medium truncate flex-1">
                              {song.audio ? "Audio Uploaded" : "Upload MP3 (Max 30s)"}
                            </span>
                            <input
                              type="file"
                              accept="audio/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    toast({
                                      title: "Audio too large",
                                      description: "Max 10MB for MP3 files",
                                      variant: "destructive"
                                    });
                                    return;
                                  }
                                  const { data } = await uploadFile(file, "songs");
                                  if (data) {
                                    const newSongs = [...localProject.songs_meta];
                                    newSongs[i] = { ...song, audio_path: data.path };
                                    setLocalProject({ ...localProject, songs_meta: newSongs });
                                    toast({ title: "Audio uploaded! 🎵" });
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Collage Tab */}
              <TabsContent value="collage" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Memories Collage</h3>
                    <p className="text-sm text-muted-foreground">Upload a special image that will be revealed in the Hidden Memories app.</p>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <GlassCard variant="subtle" className="p-6 border-white/10 group overflow-hidden relative">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-accent/20 border-2 border-dashed border-white/10 group-hover:border-primary/30 transition-all flex items-center justify-center relative">
                      {localProject.collage_url ? (
                        <>
                          <StorageImage path={localProject.collage_url} alt="Collage preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <RomanticButton variant="secondary" className="scale-90">Change Image</RomanticButton>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground p-12">
                          <ImageIcon size={48} className="mb-4 opacity-20" />
                          <p className="font-medium text-lg">Click to upload your collage</p>
                          <p className="text-xs mt-2 opacity-60">High quality PNG or JPG recommended</p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast({
                                title: "Collage too large",
                                description: "Max 10MB for memory collage",
                                variant: "destructive"
                              });
                              return;
                            }
                            const { data } = await uploadFile(file, "images");
                            if (data) {
                              setLocalProject({ ...localProject, collage_url: data.path });
                              toast({ title: "Collage uploaded! ✨" });
                            }
                          }
                        }}
                      />
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex gap-3 items-start">
                        <Heart size={16} className="text-primary mt-1" fill="currentColor" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          This image is the big reveal of your Love OS. Choose something that makes them smile!
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Relationship Analytics</h3>
                    <p className="text-sm text-muted-foreground">Customize the statistics displayed in the Love Wrapped dashboard.</p>
                  </div>
                  <RomanticButton
                    variant="secondary"
                    className="h-9 px-4 text-xs"
                    onClick={() => {
                      const newAnalytics: AnalyticsItem = {
                        project_id: project.id,
                        title: "New Stat",
                        value: "0",
                        subtitle: "Custom description",
                        icon: "heart",
                        type: "counter",
                        sort_order: localAnalytics.length
                      };
                      setLocalAnalytics([...localAnalytics, newAnalytics]);
                    }}
                  >
                    Add Custom Stat
                  </RomanticButton>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localAnalytics.map((item, i) => (
                    <GlassCard key={item.id || i} variant="subtle" className="p-5 space-y-4 border-white/10 relative group">
                      <button
                        onClick={() => {
                          const newAnalytics = localAnalytics.filter((_, idx) => idx !== i);
                          setLocalAnalytics(newAnalytics);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                      >
                        <Check size={12} className="rotate-45" />
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BarChart size={16} />
                        </div>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newAnalytics = [...localAnalytics];
                            newAnalytics[i] = { ...item, title: e.target.value };
                            setLocalAnalytics(newAnalytics);
                          }}
                          className="bg-transparent border-none p-0 h-auto font-semibold focus-visible:ring-0"
                          placeholder="Title"
                        />
                      </div>

                      <div className="space-y-3">
                        {item.type === "date" ? (
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Select Date</Label>
                            <Input
                              type="date"
                              value={item.value || ""}
                              onChange={(e) => {
                                const newAnalytics = [...localAnalytics];
                                newAnalytics[i] = { ...item, value: e.target.value };
                                setLocalAnalytics(newAnalytics);
                              }}
                              className="bg-background/40 h-10 border-white/10"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Current Value</Label>
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                const newAnalytics = [...localAnalytics];
                                newAnalytics[i] = { ...item, value: e.target.value };
                                setLocalAnalytics(newAnalytics);
                              }}
                              className="bg-background/40 h-10 border-white/10"
                              placeholder="e.g. 730"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Subtitle</Label>
                        <Input
                          value={item.subtitle}
                          onChange={(e) => {
                            const newAnalytics = [...localAnalytics];
                            newAnalytics[i] = { ...item, subtitle: e.target.value };
                            setLocalAnalytics(newAnalytics);
                          }}
                          className="bg-background/40 h-10 border-white/10"
                          placeholder="e.g. Days Together"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Type</Label>
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newAnalytics = [...localAnalytics];
                              newAnalytics[i] = { ...item, type: e.target.value };
                              setLocalAnalytics(newAnalytics);
                            }}
                            className="w-full h-10 rounded-md bg-background/40 border border-white/10 text-sm px-3 focus:outline-none focus:ring-1 focus:ring-primary/20"
                          >
                            <option value="counter">Counter</option>
                            <option value="text">Text</option>
                            <option value="date">Date</option>
                            <option value="progress">Progress</option>
                          </select>
                        </div>
                        {item.type === "progress" && (
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Max</Label>
                            <Input
                              type="number"
                              value={item.max_value || ""}
                              onChange={(e) => {
                                const newAnalytics = [...localAnalytics];
                                newAnalytics[i] = { ...item, max_value: parseInt(e.target.value) || null };
                                setLocalAnalytics(newAnalytics);
                              }}
                              className="bg-background/40 h-10 border-white/10"
                              placeholder="100"
                            />
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Love Quiz</h3>
                    <p className="text-sm text-muted-foreground">Create 10 questions to test how well they know your relationship.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const qNum = i + 1;
                    const question = localQuiz.find(q => q.question_number === qNum) || {
                      project_id: project.id,
                      question_number: qNum,
                      question: "",
                      option_1: "",
                      option_2: "",
                      option_3: "",
                      option_4: "",
                      correct_option: 1
                    };

                    const updateQuestion = (updates: Partial<QuizQuestion>) => {
                      const newQuiz = [...localQuiz];
                      const index = newQuiz.findIndex(q => q.question_number === qNum);
                      if (index !== -1) {
                        newQuiz[index] = { ...newQuiz[index], ...updates };
                      } else {
                        newQuiz.push({ ...question, ...updates });
                      }
                      setLocalQuiz(newQuiz);
                    };

                    return (
                      <GlassCard key={qNum} variant="subtle" className="p-6 space-y-4 border-white/10 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {qNum}
                          </div>
                          <Input
                            placeholder={`Question ${qNum}`}
                            value={question.question}
                            onChange={(e) => updateQuestion({ question: e.target.value })}
                            className="bg-background/40 font-medium"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 ml-11">
                          {[1, 2, 3, 4].map((optNum) => (
                            <div key={optNum} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`q-${qNum}`}
                                checked={question.correct_option === optNum}
                                onChange={() => updateQuestion({ correct_option: optNum })}
                                className="accent-primary w-4 h-4 cursor-pointer"
                              />
                              <Input
                                placeholder={`Option ${optNum}`}
                                value={(question as any)[`option_${optNum}`]}
                                onChange={(e) => updateQuestion({ [`option_${optNum}`]: e.target.value } as any)}
                                className={`bg-background/30 h-10 ${question.correct_option === optNum ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
                              />
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Terminal Tab */}
              <TabsContent value="terminal" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Terminal Commands</h3>
                    <p className="text-sm text-muted-foreground">Define custom responses for secret terminal commands (max 12).</p>
                  </div>
                  <RomanticButton
                    variant="secondary"
                    className="h-9 px-4 text-xs"
                    disabled={localTerminal.length >= 12}
                    onClick={() => {
                      const newCmd: TerminalCommand = {
                        project_id: project.id,
                        command: "",
                        output: "",
                        sort_order: localTerminal.length
                      };
                      setLocalTerminal([...localTerminal, newCmd]);
                    }}
                  >
                    Add Command
                  </RomanticButton>
                </div>

                <div className="space-y-4">
                  {localTerminal.map((cmd, i) => (
                    <GlassCard key={cmd.id || i} variant="subtle" className="p-4 border-white/10 group">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3 flex items-start gap-2">
                          <div className="pt-2 text-primary">
                            <Terminal size={16} />
                          </div>
                          <div className="flex-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Command</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">/</span>
                              <Input
                                value={cmd.command}
                                onChange={(e) => {
                                  const newTerminal = [...localTerminal];
                                  newTerminal[i] = { ...cmd, command: e.target.value.toLowerCase().replace(/\s/g, "") };
                                  setLocalTerminal(newTerminal);
                                }}
                                className="bg-background/40 font-mono pl-6"
                                placeholder="secret"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground block">Response Output</Label>
                            <button
                              onClick={() => {
                                const newTerminal = localTerminal.filter((_, idx) => idx !== i);
                                setLocalTerminal(newTerminal);
                              }}
                              className="text-[10px] text-destructive hover:underline font-medium uppercase tracking-tight"
                            >
                              Delete
                            </button>
                          </div>
                          <textarea
                            value={cmd.output}
                            onChange={(e) => {
                              const newTerminal = [...localTerminal];
                              newTerminal[i] = { ...cmd, output: e.target.value };
                              setLocalTerminal(newTerminal);
                            }}
                            className="bg-background/40 w-full rounded-md border border-white/10 p-3 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary/20"
                            placeholder="What happens when they run this?"
                          />
                        </div>
                      </div>
                    </GlassCard>
                  ))}

                  {localTerminal.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
                      <Terminal size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                      <p className="text-muted-foreground">No custom commands yet. Add some secret phrases!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </GlassCard>
      </motion.div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-card border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient text-2xl flex items-center gap-2">
              Gift Ready! <Heart size={20} className="text-primary" fill="currentColor" />
            </DialogTitle>
            <DialogDescription>
              Share this magical link with your special someone. They'll need the access code to enter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Secret Link</Label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/loveos/code?c=${shareCode}`}
                  readOnly
                  className="bg-background/50 font-mono text-sm"
                />
                <RomanticButton onClick={copyLink} variant="secondary" className="px-3">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </RomanticButton>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">Access Code</p>
              <p className="text-3xl font-bold tracking-[0.2em] text-primary">{shareCode}</p>
              <p className="text-[10px] mt-2 text-muted-foreground uppercase opacity-70">
                Never stored as plain text for security
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Edit;
