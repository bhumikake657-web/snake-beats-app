import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'SYNTH_WAVE_01', artist: 'NEURAL_LINK', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CYBER_PUNK_02', artist: 'VOID_RUNNER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'DATA_STREAM_03', artist: 'GLITCH_CORE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-cyan/20 border border-cyan flex items-center justify-center">
          <Volume2 className="text-cyan animate-pulse" size={20} />
        </div>
        <div>
          <h3 className="font-pixel text-[10px] text-cyan uppercase tracking-tighter">
            {currentTrack.title}
          </h3>
          <p className="font-pixel text-[8px] text-magenta uppercase">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md">
        <div className="h-1 w-full bg-cyan/10 relative overflow-hidden">
          <div 
            className="h-full bg-magenta transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={prevTrack} className="jarring-btn !p-2">
          <SkipBack size={16} />
        </button>
        <button 
          onClick={togglePlay} 
          className="jarring-btn !p-3 bg-cyan !text-black"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button onClick={nextTrack} className="jarring-btn !p-2">
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
