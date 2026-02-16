import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        .from('cards')
        .select('*')
        .eq('id', id)
        .eq('paid', true)
        .eq('product_type', 'voice')
        .single();
      if (err || !data) { setError('Voice message not found'); setLoading(false); return; }
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
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(30,40%,95%)] to-[hsl(340,30%,90%)]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">🎙️</motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(30,40%,95%)] to-[hsl(340,30%,90%)]">
      <div className="text-center p-8"><div className="text-5xl mb-4">🎙️</div><p className="text-muted-foreground">{error}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(30,40%,95%)] to-[hsl(340,30%,90%)] relative overflow-hidden">
      <div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
        {recipientName && <p className="text-sm font-medium text-primary mb-4">For {recipientName}</p>}

        {/* Polaroid background */}
        {bgImageUrl && (
          <motion.div
            className="mx-auto mb-6 bg-white p-3 pb-12 rounded-lg shadow-lg max-w-[200px] -rotate-3"
            animate={playing ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <img
              src={bgImageUrl}
              alt="Memory"
              className={`w-full h-40 object-cover rounded transition-all duration-500 ${playing ? 'brightness-110 saturate-110' : 'brightness-90 saturate-75 sepia-[0.2]'}`}
            />
          </motion.div>
        )}

        {/* Vinyl */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className={`w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl flex items-center justify-center ${playing ? 'animate-vinyl' : ''}`}>
            <div className="absolute inset-4 rounded-full border border-gray-700/30" />
            <div className="absolute inset-8 rounded-full border border-gray-700/20" />
            <div className="absolute inset-12 rounded-full border border-gray-700/30" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--sm-lavender))] flex items-center justify-center shadow-inner z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
            </div>
          </div>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="92" fill="none" stroke="hsl(var(--sm-lavender))" strokeWidth="3" strokeOpacity="0.2" />
            <circle cx="96" cy="96" r="92" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 92}`}
              strokeDashoffset={`${2 * Math.PI * 92 * (1 - progress / 100)}`}
              strokeLinecap="round" className="transition-all duration-300" />
          </svg>
        </div>

        <div className="font-mono text-2xl font-bold mb-6 tracking-wider">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <Button onClick={togglePlay} size="lg" className="rounded-full w-16 h-16 p-0 mx-auto shadow-xl">
          {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </Button>

        {senderName && (
          <p className="text-sm text-muted-foreground mt-6">From {senderName} 💕</p>
        )}
      </div>
    </div>
  );
};

export default VoiceViewer;
