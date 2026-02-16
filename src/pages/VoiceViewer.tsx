import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background texture-grain">
      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background texture-grain">
      <div className="text-center"><p className="font-display text-xl font-semibold">Not found</p><p className="text-muted-foreground text-sm mt-1">{error}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative texture-grain">
      <div className="surface-elevated rounded-lg border border-border p-10 max-w-sm w-full text-center">
        {recipientName && <p className="font-mono-label text-warm-wine mb-6">For {recipientName}</p>}

        {/* Polaroid */}
        {bgImageUrl && (
          <motion.div
            className="mx-auto mb-8 bg-white p-2.5 pb-10 rounded shadow-lg max-w-[180px] -rotate-2"
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

        {/* Vinyl */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className={`w-full h-full rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 shadow-xl flex items-center justify-center ${playing ? 'animate-vinyl' : ''}`}>
            <div className="absolute inset-3 rounded-full border border-neutral-700/20" />
            <div className="absolute inset-6 rounded-full border border-neutral-700/10" />
            <div className="absolute inset-10 rounded-full border border-neutral-700/20" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-wine to-warm-gold flex items-center justify-center shadow-inner z-10">
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            </div>
          </div>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="76" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <circle cx="80" cy="80" r="76" fill="none" stroke="hsl(var(--warm-wine))" strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * 76}`}
              strokeDashoffset={`${2 * Math.PI * 76 * (1 - progress / 100)}`}
              strokeLinecap="round" className="transition-all duration-300" />
          </svg>
        </div>

        <div className="font-mono text-lg font-bold mb-8 tracking-widest text-foreground">
          {fmt(currentTime)} / {fmt(duration)}
        </div>

        <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto shadow-lg hover:opacity-90 transition-opacity">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {senderName && <p className="text-sm text-muted-foreground mt-8">From {senderName}</p>}
      </div>
    </div>
  );
};

export default VoiceViewer;
