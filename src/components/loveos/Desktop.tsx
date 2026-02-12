import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Gift, Terminal, HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Taskbar from "./Taskbar";
import AppWindow from "./AppWindow";
import LoveWrapped from "./apps/LoveWrapped";
import GuessTheMoment from "./apps/GuessTheMoment";
import LoveTerminal from "./apps/LoveTerminal";
import { ParticleBackground } from "@/components/love";

export type AppType = "love-wrapped" | "guess-moment" | "love-terminal" | null;

interface DesktopProps {
  customData?: {
    project: any;
    analytics: any[];
    quiz: any[];
    terminal: any[];
  };
}

const Desktop = ({ customData }: DesktopProps) => {
  const [openApp, setOpenApp] = useState<AppType>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const apps = [
    { id: "love-wrapped" as AppType, name: "Love Wrapped", icon: Gift, color: "bg-gradient-romantic" },
    { id: "guess-moment" as AppType, name: "Guess the Moment", icon: HelpCircle, color: "bg-gradient-sunset" },
    { id: "love-terminal" as AppType, name: "Love Terminal", icon: Terminal, color: "bg-love-deep" },
  ];

  const handleOpenApp = (appId: AppType) => { setOpenApp(appId); setStartMenuOpen(false); };
  const handleCloseApp = () => setOpenApp(null);

  const renderAppContent = () => {
    switch (openApp) {
      case "love-wrapped":
        return <LoveWrapped customData={customData} />;
      case "guess-moment":
        return <GuessTheMoment customData={customData} />;
      case "love-terminal":
        return <LoveTerminal customData={customData} />;
      default:
        return null;
    }
  };

  const getAppTitle = () => apps.find((a) => a.id === openApp)?.name || "";

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background relative flex flex-col">
      <ParticleBackground variant="mixed" density="medium" />
      <div className="flex-1 relative overflow-hidden p-4">
        {!openApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {apps.map((app, index) => (
              <motion.button key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => handleOpenApp(app.id)} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-accent/30 transition-colors group">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${app.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <app.icon size={28} className="text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground font-medium text-center">{app.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
        <AnimatePresence>
          {openApp && (
            <AppWindow title={getAppTitle()} onClose={handleCloseApp} isMobile={isMobile}>
              {renderAppContent()}
            </AppWindow>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {startMenuOpen && !openApp && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 left-4 w-72 glass-card-strong p-4 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 text-gradient">Apps</h3>
              <div className="space-y-2">
                {apps.map((app) => (
                  <button key={app.id} onClick={() => handleOpenApp(app.id)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center`}><app.icon size={20} className="text-primary-foreground" /></div>
                    <span className="font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Taskbar apps={apps} openApp={openApp} onOpenApp={handleOpenApp} startMenuOpen={startMenuOpen} onToggleStartMenu={() => setStartMenuOpen(!startMenuOpen)} />
    </div>
  );
};

export default Desktop;
