import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  audioUrl?: string;
}

interface MusicGalleryProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const MusicGallery = ({ customData }: MusicGalleryProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (customData?.project?.songs_meta && Array.isArray(customData.project.songs_meta) && customData.project.songs_meta.length > 0) {
      setSongs(customData.project.songs_meta.map((s: any, i: number) => ({
        id: i + 1,
        title: s.title || `Song ${i + 1}`,
        artist: s.artist || "Unknown",
        image: s.image || "/placeholder.svg",
        audio: s.audio,
      })));
      return;
    }

    fetch("/data/songdata.json")
      .then((res) => res.json())
      .then((data) => setSongs(data.songs))
      .catch(() => setSongs([
        { id: 1, title: "Perfect", artist: "Ed Sheeran", image: "/placeholder.svg" },
        { id: 2, title: "All of Me", artist: "John Legend", image: "/placeholder.svg" },
        { id: 3, title: "Thinking Out Loud", artist: "Ed Sheeran", image: "/placeholder.svg" },
        { id: 4, title: "A Thousand Years", artist: "Christina Perri", image: "/placeholder.svg" },
        { id: 5, title: "Can't Help Falling in Love", artist: "Elvis Presley", image: "/placeholder.svg" },
        { id: 6, title: "Make You Feel My Love", artist: "Adele", image: "/placeholder.svg" },
      ]));
  }, [customData]);

  const handleCardClick = (id: number) => {
    const song = songs.find(s => s.id === id);
    if (flippedId === id) {
      setFlippedId(null);
      setPlayingId(null);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setFlippedId(id);
      setPlayingId(id);
      if (song?.audio) {
        const audio = new Audio(song.audio);
        audio.play().catch(() => { });
        audio.onended = () => { setPlayingId(null); audioRef.current = null; };
        audioRef.current = audio;
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {songs.map((song, index) => (
        <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="aspect-square perspective-1000">
          <motion.div className="relative w-full h-full cursor-pointer" onClick={() => handleCardClick(song.id)} animate={{ rotateY: flippedId === song.id ? 180 : 0 }} transition={{ duration: 0.6, type: "spring" }} style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden glass-card" style={{ backfaceVisibility: "hidden" }}>
              {song.image && song.image !== "/placeholder.svg" ? (
                <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-love-coral/20 flex items-center justify-center">
                  <div className="text-center"><Music size={40} className="text-primary mx-auto mb-2" /><span className="text-sm text-muted-foreground">Tap to reveal</span></div>
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl overflow-hidden glass-card-strong p-4 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <motion.div animate={playingId === song.id ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center mb-4">
                {playingId === song.id ? <Pause size={28} className="text-primary-foreground" /> : <Play size={28} className="text-primary-foreground ml-1" />}
              </motion.div>
              <h3 className="font-bold text-foreground text-lg mb-1">{song.title}</h3>
              <p className="text-muted-foreground text-sm">{song.artist}</p>
              {playingId === song.id && (
                <div className="flex items-end justify-center gap-1 mt-4 h-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} className="w-1 bg-primary rounded-full" animate={{ height: [8, 24, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default MusicGallery;
