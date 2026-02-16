import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Pause, Upload, Trash2 } from 'lucide-react';
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setRecording(true);

      timerRef.current = window.setInterval(() => {
        setDuration((d) => {
          if (d >= MAX_DURATION - 1) {
            mr.stop();
            setRecording(false);
            clearInterval(timerRef.current);
            return MAX_DURATION;
          }
          return d + 1;
        });
      }, 1000);
    } catch {
      alert('Microphone access is required to record a voice message.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
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
    if (file) {
      setBgImage(file);
      setBgPreview(URL.createObjectURL(file));
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSave = () => setShowPlanDialog(true);

  const handlePlanSelect = async (plan: PlanType) => {
    // Store audio blob and bg image as base64 in localStorage temporarily
    // They'll be uploaded to storage during checkout
    const audioB64 = audioBlob ? await blobToBase64(audioBlob) : null;
    const bgB64 = bgImage ? await blobToBase64(bgImage) : null;

    localStorage.setItem(
      'pendingCard',
      JSON.stringify({
        productType: 'voice',
        recipientName,
        senderName,
        voiceDuration: duration,
        voiceAudioBase64: audioB64,
        voiceBgBase64: bgB64,
        question: `A voice message for ${recipientName || 'you'}`,
        yesMessage: 'Press play to hear my message 🎙️',
      })
    );
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingProductType', 'voice');
    setShowPlanDialog(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(30,40%,95%)] to-[hsl(340,30%,90%)]">
      {/* Header */}
      <header className="py-3 px-6 border-b border-border/50 glass-strong sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-lg font-bold">Voice Message</span>
            <span className="text-lg">🎙️</span>
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Record Your Message</h1>
          <p className="text-muted-foreground">Up to 60 seconds of heartfelt audio on a vintage vinyl</p>
        </div>

        {/* Names */}
        <div className="glass-strong rounded-3xl p-5 space-y-4 mb-6">
          <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} />
          <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} />
        </div>

        {/* Vinyl Record */}
        <div className="glass-strong rounded-3xl p-8 flex flex-col items-center mb-6">
          <div className="relative w-64 h-64 mb-6">
            {/* Vinyl disc */}
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl flex items-center justify-center ${playing ? 'animate-vinyl' : 'animate-vinyl-paused'}`}>
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border border-gray-700/30" />
              <div className="absolute inset-8 rounded-full border border-gray-700/20" />
              <div className="absolute inset-12 rounded-full border border-gray-700/30" />
              <div className="absolute inset-16 rounded-full border border-gray-700/20" />
              {/* Center label */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--sm-lavender))] flex items-center justify-center shadow-inner z-10">
                <div className="w-3 h-3 rounded-full bg-gray-900" />
              </div>
            </div>

            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="124" fill="none" stroke="hsl(var(--sm-lavender))" strokeWidth="3" strokeOpacity="0.2" />
              <circle
                cx="128" cy="128" r="124" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 124}`}
                strokeDashoffset={`${2 * Math.PI * 124 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          </div>

          {/* Timer */}
          <div className="font-mono text-3xl font-bold text-foreground mb-6 tracking-wider">
            {recording ? formatTime(duration) : audioUrl ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '00:00'}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {!audioUrl && !recording && (
              <Button onClick={startRecording} size="lg" className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 shadow-xl animate-glow">
                <Mic className="w-7 h-7 text-white" />
              </Button>
            )}
            {recording && (
              <Button onClick={stopRecording} size="lg" className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 shadow-xl">
                <Square className="w-6 h-6 text-white fill-white" />
              </Button>
            )}
            {audioUrl && !recording && (
              <>
                <Button onClick={togglePlay} size="lg" className="rounded-full w-16 h-16 p-0 shadow-xl">
                  {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setAudioBlob(null);
                    setAudioUrl(null);
                    setDuration(0);
                    setCurrentTime(0);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Re-record
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Background photo */}
        <div className="glass-strong rounded-3xl p-5 mb-6">
          <h3 className="font-display text-lg font-semibold mb-3">Background Photo (optional)</h3>
          <p className="text-xs text-muted-foreground mb-3">Appears as a Polaroid behind the vinyl when they play it</p>
          {bgPreview ? (
            <div className="relative">
              <img src={bgPreview} alt="Background" className="w-full h-48 object-cover rounded-2xl" />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 rounded-full"
                onClick={() => { setBgImage(null); setBgPreview(null); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Upload photo</span>
              <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Save */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            disabled={!audioBlob}
            size="lg"
            className="rounded-full text-lg px-10 py-6 animate-glow bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]"
          >
            Send Voice Message 🎙️
          </Button>
        </div>
      </div>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} />
    </div>
  );
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export default VoiceCreate;
