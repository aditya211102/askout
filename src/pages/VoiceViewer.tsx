import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BAR_COUNT = 40;

const VoiceViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voiceUrl, setVoiceUrl] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [waveformBars] = useState(() => Array.from({ length: BAR_COUNT }, () => 0.2 + Math.random() * 0.8));

  useEffect(() => {
    const load = async () => {
      if (!id) { setError('Not found'); setLoading(false); return; }
      const { data, error: err } = await supabase
        .from('cards').select('*').eq('id', id).eq('paid', true).eq('product_type', 'voice').single();
      if (err || !data) { setError('Not found'); setLoading(false); return; }
      setVoiceUrl(data.voice_note_url || '');
      setBgImageUrl(data.voice_background_image || '');
      setSenderName(data.sender_name || '');
      setRecipientName(data.recipient_name || '');
      setDuration(data.voice_duration || 0);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (voiceUrl) {
      const audio = new Audio(voiceUrl);
      audioRef.current = audio;
      audio.onended = () => { setPlaying(false); setCurrentTime(0); };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => { if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration); };
      return () => { audio.pause(); audio.src = ''; };
    }
  }, [voiceUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBar = Math.floor(progress * BAR_COUNT);
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(30,20%,18%)]">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(30,20%,18%)] text-[hsl(40,33%,90%)]">
      <div className="text-center"><p className="font-display text-xl font-semibold">Not found</p><p className="text-[hsl(40,33%,55%)] text-sm mt-1">{error}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[hsl(30,20%,18%)] relative">
      <div className="max-w-sm w-full">
        {recipientName && <p className="font-mono-label text-[hsl(40,33%,55%)] text-center mb-6">For {recipientName}</p>}

        {/* Journal card */}
        <div className="rounded-xl bg-[hsl(38,25%,92%)] text-[hsl(20,18%,15%)] p-8 shadow-2xl relative overflow-hidden">
          {/* Notebook lines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, hsl(352,36%,60%,0.1) 27px, hsl(352,36%,60%,0.1) 28px)',
            backgroundPosition: '0 20px',
          }} />
          <div className="absolute left-12 top-0 bottom-0 w-px bg-[hsl(352,36%,70%,0.3)]" />

          <div className="relative z-10">
            {/* Polaroid photo */}
            {bgImageUrl && (
              <motion.div
                className="mx-auto mb-8 bg-white p-2.5 pb-8 rounded shadow-lg max-w-[180px] -rotate-2"
                animate={playing ? { scale: [1, 1.01, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                <img
                  src={bgImageUrl}
                  alt="Memory"
                  className={`w-full h-36 object-cover rounded-sm transition-all duration-700 ${playing ? '' : 'saturate-50 brightness-95'}`}
                />
              </motion.div>
            )}

            {/* Timer */}
            <div className="text-center mb-6">
              <span className="font-mono text-2xl font-bold tracking-widest text-[hsl(20,18%,20%)]">
                {fmt(currentTime)} / {fmt(duration)}
              </span>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-[2px] h-14 mb-8 px-4">
              {waveformBars.map((height, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full transition-colors duration-150"
                  style={{
                    height: `${height * 100}%`,
                    backgroundColor: i <= activeBar ? 'hsl(352,36%,45%)' : 'hsl(20,10%,75%)',
                  }}
                />
              ))}
            </div>

            {/* Play */}
            <div className="flex justify-center">
              <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-[hsl(20,18%,15%)] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>

        {senderName && <p className="text-sm text-[hsl(40,33%,55%)] text-center mt-8">From {senderName}</p>}
      </div>
    </div>
  );
};

export default VoiceViewer;
