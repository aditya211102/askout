import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Pause, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlanDialog, { type PlanType } from '@/components/PlanDialog';
import VoicePreview from '@/components/VoicePreview';

const MAX_DURATION = 60;
const BAR_COUNT = 40;

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
  const [waveformBars] = useState(() => Array.from({ length: BAR_COUNT }, () => 0.2 + Math.random() * 0.8));

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

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[hsl(30,20%,18%)] text-[hsl(40,33%,90%)] relative">
      {/* Warm dark grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <header className="sticky top-0 z-20 bg-[hsl(30,20%,18%)]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-[hsl(40,33%,80%)] hover:text-[hsl(40,33%,95%)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono-label">Back</span>
          </button>
          <span className="font-display text-sm text-[hsl(40,33%,60%)] italic">Voice Note</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <p className="font-mono-label text-[hsl(40,33%,55%)] mb-4">Record up to 60 seconds</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight italic text-[hsl(40,33%,92%)]">
            Your voice note
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-12">
          {/* Controls */}
          <div className="space-y-8">
            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono-label text-[hsl(40,33%,55%)] block mb-2">For</label>
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} className="bg-white/5 border-white/10 text-[hsl(40,33%,90%)] placeholder:text-[hsl(40,33%,40%)]" />
              </div>
              <div>
                <label className="font-mono-label text-[hsl(40,33%,55%)] block mb-2">From</label>
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} className="bg-white/5 border-white/10 text-[hsl(40,33%,90%)] placeholder:text-[hsl(40,33%,40%)]" />
              </div>
            </div>

            {/* Recording area */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-8 flex flex-col items-center">
              {/* Timer */}
              <div className="text-center mb-6">
                <span className="font-mono text-4xl font-bold tracking-widest text-[hsl(40,33%,90%)]">
                  {recording ? fmt(duration) : audioUrl ? `${fmt(currentTime)} / ${fmt(duration)}` : '00:00'}
                </span>
                {recording && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(352,50%,45%)] animate-pulse" />
                    <span className="font-mono-label text-[hsl(352,50%,55%)]">Recording</span>
                  </div>
                )}
              </div>

              {/* Waveform in controls */}
              <div className="flex items-center justify-center gap-[2px] h-16 mb-8 px-4 w-full max-w-md">
                {waveformBars.map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{
                      height: `${height * 100}%`,
                      backgroundColor: recording
                        ? 'hsl(352,36%,55%)'
                        : i <= Math.floor((duration > 0 ? currentTime / duration : 0) * BAR_COUNT)
                          ? 'hsl(352,36%,55%)'
                          : 'hsl(40,10%,35%)',
                    }}
                    animate={recording ? {
                      scaleY: [1, 0.5 + Math.random() * 1.2, 1],
                    } : {}}
                    transition={recording ? {
                      repeat: Infinity,
                      duration: 0.3 + Math.random() * 0.4,
                      ease: 'easeInOut',
                    } : {}}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!audioUrl && !recording && (
                  <button onClick={startRecording} className="w-16 h-16 rounded-full bg-[hsl(352,50%,45%)] flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-all hover:scale-105">
                    <Mic className="w-7 h-7" />
                  </button>
                )}
                {recording && (
                  <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-[hsl(352,50%,45%)] flex items-center justify-center text-white shadow-lg">
                    <Square className="w-6 h-6 fill-white" />
                  </button>
                )}
                {audioUrl && !recording && (
                  <>
                    <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-[hsl(40,33%,90%)] flex items-center justify-center text-[hsl(20,18%,15%)] shadow-lg hover:opacity-90 transition-all">
                      {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <button
                      onClick={() => { setAudioBlob(null); setAudioUrl(null); setDuration(0); setCurrentTime(0); }}
                      className="font-mono-label text-[hsl(40,33%,50%)] hover:text-[hsl(40,33%,80%)] transition-colors"
                    >
                      Re-record
                    </button>
                  </>
                )}
              </div>
              {!audioUrl && !recording && (
                <p className="font-display italic text-[hsl(40,33%,45%)] mt-4 text-sm">Tap to record</p>
              )}
            </div>

            {/* Background photo upload */}
            <div>
              <p className="font-mono-label text-[hsl(40,33%,55%)] mb-4">Add a photo <span className="text-[hsl(40,33%,40%)]">(optional)</span></p>
              {bgPreview ? (
                <div className="relative inline-block">
                  <div className="bg-white p-2 pb-7 rounded shadow-md max-w-[200px] -rotate-1">
                    <img src={bgPreview} alt="Memory" className="w-full h-32 object-cover rounded-sm" />
                  </div>
                  <button onClick={() => { setBgImage(null); setBgPreview(null); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[hsl(20,18%,15%)]/80 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-white/15 hover:border-white/30 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-[hsl(40,33%,50%)] mb-2" />
                  <span className="font-mono-label text-[hsl(40,33%,50%)]">Upload photo</span>
                  <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-[hsl(30,18%,14%)] border border-white/10 p-6 min-h-[460px] flex flex-col items-center justify-center relative">
              <p className="font-mono-label text-[hsl(40,33%,45%)] absolute top-4 left-4">Preview</p>
              <div className="mt-4 w-full">
                <VoicePreview
                  playing={playing}
                  currentTime={currentTime}
                  duration={duration}
                  bgPreview={bgPreview}
                  senderName={senderName}
                  recipientName={recipientName}
                  waveformBars={waveformBars}
                  onTogglePlay={audioUrl ? togglePlay : undefined}
                  recording={recording}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setShowPlanDialog(true)}
                disabled={!audioBlob}
                className="rounded-full px-10 py-6 bg-[hsl(40,33%,90%)] text-[hsl(20,18%,15%)] hover:bg-[hsl(40,33%,85%)] w-full font-medium disabled:opacity-30"
              >
                Send voice note — $2.99
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} />
    </div>
  );
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => { const r = new FileReader(); r.onloadend = () => resolve(r.result as string); r.readAsDataURL(blob); });
}

export default VoiceCreate;
