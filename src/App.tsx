import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Terminal, Shield, Zap, AlertTriangle, Github } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

const SPEEDS = {
  STABLE: 120,
  OVERCLOCK: 80,
  CRITICAL: 40
};

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(SPEEDS.OVERCLOCK);
  const [logs, setLogs] = useState<string[]>(['SYSTEM_INITIALIZED', 'NEURAL_LINK_ESTABLISHED']);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  }, []);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan flex flex-col items-center justify-start p-4 relative overflow-y-auto screen-tear">
      <div className="scanlines" />
      
      {/* Cryptic Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-12 z-10 border-b-2 border-magenta pb-4 gap-8"
      >
        <div className="flex items-center gap-4">
          <Terminal className="text-magenta animate-pulse" size={32} />
          <div>
            <h1 className="glitch-text text-3xl" data-text="NEURAL_SNAKE_v0.9">
              NEURAL_SNAKE_v0.9
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] text-magenta font-pixel tracking-widest">
                STATUS: STABLE // UPLINK_ACTIVE
              </p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan hover:text-magenta transition-colors"
                title="SOURCE_CODE_ACCESS"
              >
                <Github size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-pixel text-magenta mb-2 uppercase">Neural_Archive</span>
            <div className="flex items-center gap-3">
              <Cpu size={20} className="text-magenta" />
              <span className="glitch-text text-5xl" data-text={highScore}>{highScore}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-pixel text-cyan mb-2 uppercase">Current_Sync</span>
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-cyan" />
              <span className="glitch-text text-5xl" data-text={score}>{score}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Interface */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 z-10">
        
        {/* Left Sidebar: Difficulty & Stats */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <section className="border-2 border-magenta p-4 bg-black/50">
            <h3 className="text-[10px] font-pixel text-magenta mb-4 flex items-center gap-2">
              <Zap size={12} /> CLOCK_SPEED_MODULATION
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(SPEEDS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSpeed(val);
                    addLog(`CLOCK_SPEED_SET_TO_${key}`);
                  }}
                  className={`jarring-btn w-full text-left ${speed === val ? 'bg-cyan !text-black' : ''}`}
                >
                  {key} [{val}ms]
                </button>
              ))}
            </div>
          </section>

          <section className="border-2 border-cyan p-4 bg-black/50">
            <h3 className="text-[10px] font-pixel text-cyan mb-4 flex items-center gap-2">
              <Shield size={12} /> SYSTEM_INTEGRITY
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-pixel">BUFFER_HEALTH</span>
                <div className="w-24 h-2 bg-cyan/20">
                  <div className="h-full bg-cyan" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-pixel">LATENCY</span>
                <span className="text-[10px] font-pixel text-magenta">12ms</span>
              </div>
            </div>
          </section>
        </div>

        {/* Center: Game Core */}
        <div className="lg:col-span-6 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-4 border-cyan p-2 bg-black relative shadow-[0_0_30px_rgba(0,255,255,0.2)]"
          >
            <div className="absolute -top-4 -left-4 bg-magenta text-black font-pixel text-[8px] px-2 py-1 z-30">
              CORE_RENDER_ACTIVE
            </div>
            <SnakeGame onScoreChange={handleScoreChange} onEvent={addLog} speed={speed} />
          </motion.div>

          <div className="w-full border-2 border-magenta p-4 bg-black/50">
            <div className="text-[8px] font-pixel text-magenta mb-4 tracking-tighter uppercase">
              Audio_Buffer_Streaming...
            </div>
            <MusicPlayer />
          </div>
        </div>

        {/* Right Sidebar: System Log */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <section className="border-2 border-magenta p-4 bg-black/50 h-[400px] flex flex-col">
            <h3 className="text-[10px] font-pixel text-magenta mb-4 flex items-center gap-2">
              SYSTEM_LOG_STREAM
            </h3>
            <div className="flex-1 overflow-hidden font-terminal text-[12px] text-cyan/70 space-y-1">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex gap-2"
                  >
                    <span className="text-magenta">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <span className="uppercase">{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Cryptic Footer */}
      <footer className="w-full max-w-6xl mt-12 py-8 border-t border-cyan/20 text-[8px] font-pixel text-cyan/30 flex flex-wrap gap-12 items-center justify-center uppercase">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-magenta animate-ping" />
          <span>SIGNAL_STRENGTH: 98%</span>
        </div>
        <div>ENCRYPTION: AES-256-GLITCH</div>
        <div>NODE_ID: AIS-CORE-0X9F</div>
        <div className="animate-pulse">SYSTEM_TIME: {new Date().toLocaleTimeString()}</div>
      </footer>

      {/* Side Data Streams */}
      <div className="fixed left-4 top-0 h-full w-px bg-cyan/20 hidden xl:block" />
      <div className="fixed right-4 top-0 h-full w-px bg-magenta/20 hidden xl:block" />
    </div>
  );
}
