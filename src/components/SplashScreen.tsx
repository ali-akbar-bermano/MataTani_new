import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Scan, Sparkles, ChevronRight, Leaf, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // minimum time in ms before automatically completing
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusPhase, setStatusPhase] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const statusMessages = [
    { text: 'Memuat modul visi agronomi & kecerdasan buatan...', icon: Sparkles },
    { text: 'Mengalibrasi spektrum daun & sensor kelembapan...', icon: Scan },
    { text: 'Sinkronisasi ensiklopedia hama & dosis pertanian...', icon: Leaf },
    { text: 'Sistem siap. Selamat datang di MataTani!', icon: ShieldCheck },
  ];

  useEffect(() => {
    // Immediately remove or hide #app-pre-splash once React component mounts
    const preSplash = document.getElementById('app-pre-splash');
    if (preSplash) {
      preSplash.style.opacity = '0';
      preSplash.style.pointerEvents = 'none';
      setTimeout(() => {
        preSplash.remove();
      }, 500);
    }

    const startTime = Date.now();
    const intervalTime = 25; // updates every 25ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / minDuration) * 100, 100);

      // Smooth easing curve
      setProgress(Math.floor(rawProgress));

      if (rawProgress < 30) {
        setStatusPhase(0);
      } else if (rawProgress < 65) {
        setStatusPhase(1);
      } else if (rawProgress < 90) {
        setStatusPhase(2);
      } else {
        setStatusPhase(3);
      }

      if (rawProgress >= 100) {
        clearInterval(timer);
        // Small lingering moment on 100% before transition
        setTimeout(() => {
          handleFinish();
        }, 350);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration]);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600); // Wait for exit animation
  };

  const currentStatus = statusMessages[statusPhase] || statusMessages[0];
  const CurrentIcon = currentStatus.icon;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden bg-[#07150C]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 38%, rgba(20, 83, 45, 0.45) 0%, rgba(11, 34, 21, 0.95) 55%, #050E08 100%)`,
          }}
        >
          {/* Subtle Ambient Glow and Grid Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Soft animated light orbs */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-green-500/15 blur-3xl"
            />

            {/* Subtle Agricultural Grid Lines */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
              }}
            />

            {/* Floating Organic Leaves Particles */}
            {[
              { x: '15%', y: '25%', size: 16, delay: 0, rot: 45 },
              { x: '82%', y: '20%', size: 20, delay: 0.4, rot: -30 },
              { x: '22%', y: '75%', size: 18, delay: 0.8, rot: 15 },
              { x: '78%', y: '70%', size: 22, delay: 1.2, rot: -60 },
              { x: '50%', y: '12%', size: 14, delay: 0.6, rot: 20 },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0.15, 0.45, 0.15],
                  y: [-10, 10, -10],
                  rotate: [p.rot, p.rot + 20, p.rot],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: p.delay,
                }}
                className="absolute text-emerald-400/30 pointer-events-none"
                style={{ left: p.x, top: p.y }}
              >
                <Leaf style={{ width: p.size, height: p.size }} />
              </motion.div>
            ))}
          </div>

          {/* Top Bar: Brand Kicker & Skip Button */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-emerald-400/80">
                MataTani Agronomy Vision
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-200/80 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 backdrop-blur-md transition-all cursor-pointer group"
            >
              <span>Lewati</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>

          {/* Centerpiece: Emblem, Scanning Rings, & Brand Title */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-md w-full">
            {/* Animated Logo Container with Scanning Radar Rings */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Outer Pulsing Wave 1 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.9, 1.35, 1.5],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-emerald-500/30"
              />

              {/* Outer Pulsing Wave 2 (Offset) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.9, 1.4, 1.6],
                  opacity: [0.4, 0.15, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.8,
                }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-emerald-400/20"
              />

              {/* Outer Rotating Dotted Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-dashed border-emerald-500/25 pointer-events-none"
              />

              {/* AI Vision Corner Target Brackets */}
              <div className="absolute w-28 h-28 sm:w-32 sm:h-32 pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400 rounded-br-sm" />
              </div>

              {/* Central Solid Logo Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 20,
                  delay: 0.15,
                }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#143823] via-[#0D2919] to-[#06180E] border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 flex items-center justify-center overflow-hidden group"
              >
                {/* Radial highlight in badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-white/10 pointer-events-none" />

                {/* Animated Horizontal Scan Beam */}
                <motion.div
                  animate={{
                    y: [-40, 40, -40],
                    opacity: [0.2, 0.9, 0.2],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[1px] pointer-events-none shadow-[0_0_12px_#34D399]"
                />

                {/* Main Sprout Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 flex items-center justify-center text-white"
                >
                  <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-[0_2px_12px_rgba(52,211,153,0.6)]" />
                </motion.div>
              </motion.div>
            </div>

            {/* App Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="space-y-1.5"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
                <span>Mata</span>
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
                  Tani
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs sm:text-sm font-medium text-emerald-200/80 tracking-wide"
              >
                Pertanian Cerdas · Panen Berkualitas
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom Area: Dynamic Status Message & Progress Indicator */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center space-y-4">
            {/* Status message with fade transition */}
            <div className="h-6 flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={statusPhase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 text-xs text-emerald-300/90 font-medium"
                >
                  <CurrentIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{currentStatus.text}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glowing Modern Progress Bar Container */}
            <div className="w-full space-y-2">
              <div className="relative w-full h-1.5 sm:h-2 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-900/60 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-300 rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                >
                  {/* Glowing lead tip on progress bar */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#34D399]" />
                </motion.div>
              </div>

              {/* Percentage & Micro Label */}
              <div className="flex items-center justify-between text-[11px] text-emerald-400/60 font-mono">
                <span>INISIATIF PERTANIAN PRESISI</span>
                <span className="font-semibold text-emerald-300">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
