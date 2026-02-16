import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Pause, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlanDialog, { type PlanType } from '@/components/PlanDialog';

const MAX_DURATION = 60;

const VoiceCreate = () => {
  const navigate = useNavigate();
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      setDuration(0);
      setCurrentTime(0);

      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);

      timerRef.current = window.setInterval(() => {
        setDuration((d) => {
          if (d >= MAX_DURATION - 1) { mr.stop(); setRecording(false); clearInterval(timerRef.current); return MAX_DURATION; }
          return d + 1;
        });
      }, 1000);
    } catch { alert('Microphone access required.'); }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { setPlaying(false); setCurrentTime(0); };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      return () => { audio.pause(); audio.src = ''; };
    }
  }, [audioUrl]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setBgImage(file); setBgPreview(URL.createObjectURL(file)); }
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlanSelect = async (plan: PlanType) => {
    const audioB64 = audioBlob ? await blobToBase64(audioBlob) : null;
    const bgB64 = bgImage ? await blobToBase64(bgImage) : null;
    localStorage.setItem('pendingCard', JSON.stringify({
      productType: 'voice', recipientName, senderName, voiceDuration: duration,
      voiceAudioBase64: audioB64, voiceBgBase64: bgB64,
      question: `A voice message for ${recipientName || 'you'}`,
      yesMessage: 'Press play to hear my message',
    }));
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingProductType', 'voice');
    setShowPlanDialog(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background relative texture-grain">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-foreground hover:text-warm-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono-label">Voice</span>
          </button>
          <span className="font-display text-sm text-muted-foreground italic">Voice Message</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="font-mono-label text-muted-foreground mb-3">Record</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Your message</h1>
          <p className="text-muted-foreground mt-3 text-sm">Up to 60 seconds. Delivered on a vinyl.</p>
        </div>

        {/* Names */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div>
            <label className="font-mono-label text-muted-foreground block mb-2">For</label>
            <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} className="bg-transparent" />
          </div>
          <div>
            <label className="font-mono-label text-muted-foreground block mb-2">From</label>
            <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} className="bg-transparent" />
          </div>
        </div>

        {/* Vinyl */}
        <div className="surface-elevated rounded-lg border border-border p-10 flex flex-col items-center mb-8">
          <div className="relative w-52 h-52 mb-8">
            {/* Vinyl disc */}
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 shadow-2xl flex items-center justify-center ${playing ? 'animate-vinyl' : ''}`}>
              <div className="absolute inset-4 rounded-full border border-neutral-700/20" />
              <div className="absolute inset-8 rounded-full border border-neutral-700/10" />
              <div className="absolute inset-12 rounded-full border border-neutral-700/20" />
              <div className="absolute inset-16 rounded-full border border-neutral-700/10" />
              {/* Label */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-wine to-warm-gold flex items-center justify-center shadow-inner z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>
            </div>

            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 208 208">
              <circle cx="104" cy="104" r="100" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
              <circle cx="104" cy="104" r="100" fill="none" stroke="hsl(var(--warm-wine))" strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
                strokeLinecap="round" className="transition-all duration-300" />
            </svg>
          </div>

          {/* Timer */}
          <div className="font-mono text-2xl font-bold text-foreground mb-8 tracking-widest">
            {recording ? fmt(duration) : audioUrl ? `${fmt(currentTime)} / ${fmt(duration)}` : '00:00'}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {!audioUrl && !recording && (
              <button onClick={startRecording} className="w-14 h-14 rounded-full bg-warm-wine flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity">
                <Mic className="w-6 h-6" />
              </button>
            )}
            {recording && (
              <button onClick={stopRecording} className="w-14 h-14 rounded-full bg-warm-wine flex items-center justify-center text-white shadow-lg">
                <Square className="w-5 h-5 fill-white" />
              </button>
            )}
            {audioUrl && !recording && (
              <>
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background shadow-lg hover:opacity-90 transition-opacity">
                  {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <button
                  onClick={() => { setAudioBlob(null); setAudioUrl(null); setDuration(0); setCurrentTime(0); }}
                  className="font-mono-label text-muted-foreground hover:text-foreground transition-colors"
                >
                  Re-record
                </button>
              </>
            )}
          </div>
          {!audioUrl && !recording && (
            <p className="font-mono-label text-muted-foreground/60 mt-4">Tap to record</p>
          )}
        </div>

        {/* Background photo */}
        <div className="mb-10">
          <p className="font-mono-label text-muted-foreground mb-4">Background photo <span className="text-muted-foreground/50">(optional)</span></p>
          {bgPreview ? (
            <div className="relative inline-block">
              <img src={bgPreview} alt="Background" className="w-full max-w-[280px] h-44 object-cover rounded-lg border border-border" />
              <button onClick={() => { setBgImage(null); setBgPreview(null); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-28 rounded-lg border border-dashed border-border hover:border-foreground/30 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground mb-2" />
              <span className="font-mono-label text-muted-foreground">Upload photo</span>
              <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Save */}
        <Button
          onClick={() => setShowPlanDialog(true)}
          disabled={!audioBlob}
          className="rounded-full px-10 py-6 bg-foreground text-background hover:bg-foreground/90 w-full"
        >
          Send voice message
        </Button>
      </div>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} />
    </div>
  );
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => { const r = new FileReader(); r.onloadend = () => resolve(r.result as string); r.readAsDataURL(blob); });
}

export default VoiceCreate;
