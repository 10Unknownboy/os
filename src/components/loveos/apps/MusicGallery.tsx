import { useState, useEffect, useRef, useCallback } from "react";
import { SongCard } from "./SongCard";

interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  audio: string;
}

interface MusicGalleryProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const MusicGallery = ({ customData }: MusicGalleryProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioUrlMap, setAudioUrlMap] = useState<Record<number, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (customData?.project?.songs_meta && Array.isArray(customData.project.songs_meta) && customData.project.songs_meta.length > 0) {
      setSongs(customData.project.songs_meta.map((s: any, i: number) => ({
        id: i + 1,
        title: s.title || `Song ${i + 1}`,
        artist: s.artist || "Unknown",
        image: s.image,
        audio: s.audio,
      })));
      return;
    }

    // Default mock data
    setSongs([
      { id: 1, title: "Perfect", artist: "Ed Sheeran", image: "", audio: "" },
      { id: 2, title: "All of Me", artist: "John Legend", image: "", audio: "" },
      { id: 3, title: "Thinking Out Loud", artist: "Ed Sheeran", image: "", audio: "" },
      { id: 4, title: "A Thousand Years", artist: "Christina Perri", image: "", audio: "" },
      { id: 5, title: "Can't Help Falling in Love", artist: "Elvis Presley", image: "", audio: "" },
      { id: 6, title: "Make You Feel My Love", artist: "Adele", image: "", audio: "" },
    ]);
  }, [customData]);

  const handleAudioReady = useCallback((id: number, url: string) => {
    setAudioUrlMap(prev => ({ ...prev, [id]: url }));
  }, []);

  const handleCardClick = (id: number) => {
    const resolvedUrl = audioUrlMap[id];

    if (flippedId === id) {
      setFlippedId(null);
      setPlayingId(null);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setFlippedId(id);

      if (resolvedUrl) {
        setPlayingId(id);
        const audio = new Audio(resolvedUrl);
        audio.play().catch(() => { });
        audio.onended = () => { setPlayingId(null); audioRef.current = null; };
        audioRef.current = audio;
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isFlipped={flippedId === song.id}
          isPlaying={playingId === song.id}
          onClick={handleCardClick}
          onAudioReady={(url) => handleAudioReady(song.id, url)}
        />
      ))}
    </div>
  );
};

export default MusicGallery;
