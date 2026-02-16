import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface VoicePreviewProps {
  playing: boolean;
  currentTime: number;
  duration: number;
  bgPreview?: string | null;
  senderName?: string;
  recipientName?: string;
  waveformBars: number[];
  onTogglePlay?: () => void;
  recording?: boolean;
}

const BAR_COUNT = 40;

const VoicePreview = ({
  playing,
  currentTime,
  duration,
  bgPreview,
  senderName,
  recipientName,
  waveformBars,
  onTogglePlay,
  recording,
}: VoicePreviewProps) => {
  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBar = Math.floor(progress * waveformBars.length);
  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-sm mx-auto">
      {recipientName && (
        <p className="font-mono-label text-[hsl(40,33%,55%)] text-center mb-4">
          For {recipientName}
        </p>
      )}

      {/* Journal card */}
      <div className="rounded-xl bg-[hsl(38,25%,92%)] text-[hsl(20,18%,15%)] p-6 shadow-2xl relative overflow-hidden">
        {/* Notebook ruled lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 27px, hsl(352,36%,60%,0.08) 27px, hsl(352,36%,60%,0.08) 28px)',
            backgroundPosition: '0 16px',
          }}
        />
        {/* Red margin */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-[hsl(352,36%,70%,0.25)]" />

        <div className="relative z-10">
          {/* Polaroid photo */}
          {bgPreview && (
            <motion.div
              className="mx-auto mb-5 bg-white p-2 pb-7 rounded shadow-md max-w-[140px] -rotate-2"
              animate={playing ? { scale: [1, 1.01, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <img
                src={bgPreview}
                alt="Memory"
                className={`w-full h-28 object-cover rounded-sm transition-all duration-700 ${
                  playing ? '' : 'saturate-50 brightness-95'
                }`}
              />
            </motion.div>
          )}

          {/* Timer */}
          <div className="text-center mb-4">
            <span className="font-mono text-xl font-bold tracking-widest text-[hsl(20,18%,20%)]">
              {recording
                ? fmt(duration)
                : duration > 0
                  ? `${fmt(currentTime)} / ${fmt(duration)}`
                  : '00:00'}
            </span>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-[2px] h-12 mb-5 px-2">
            {waveformBars.map((height, i) => (
              <motion.div
                key={i}
                className="w-[2.5px] rounded-full transition-colors duration-150"
                style={{
                  height: `${height * 100}%`,
                  backgroundColor: recording
                    ? 'hsl(352,36%,45%)'
                    : i <= activeBar
                      ? 'hsl(352,36%,45%)'
                      : 'hsl(20,10%,78%)',
                }}
                animate={
                  recording
                    ? { scaleY: [1, 0.4 + Math.random() * 1.3, 1] }
                    : {}
                }
                transition={
                  recording
                    ? {
                        repeat: Infinity,
                        duration: 0.3 + Math.random() * 0.4,
                        ease: 'easeInOut',
                      }
                    : {}
                }
              />
            ))}
          </div>

          {/* Play button (only in preview / playback mode) */}
          {onTogglePlay && duration > 0 && !recording && (
            <div className="flex justify-center">
              <button
                onClick={onTogglePlay}
                className="w-11 h-11 rounded-full bg-[hsl(20,18%,15%)] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
              >
                {playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {senderName && (
        <p className="text-xs text-[hsl(40,33%,50%)] text-center mt-4 font-mono-label">
          From {senderName}
        </p>
      )}
    </div>
  );
};

export default VoicePreview;
