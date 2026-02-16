import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const raw = localStorage.getItem('pendingCard');
      const plan = localStorage.getItem('pendingPlan') || 'basic';
      const productType = localStorage.getItem('pendingProductType') || 'askout';
      if (!raw) { navigate('/'); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }

      const cardData = JSON.parse(raw);

      // Handle file uploads for voice messages
      let voiceNoteUrl: string | null = null;
      let voiceBgUrl: string | null = null;

      if (productType === 'voice') {
        if (cardData.voiceAudioBase64) {
          const audioBlob = base64ToBlob(cardData.voiceAudioBase64);
          const audioPath = `${session.user.id}/${Date.now()}-voice.webm`;
          const { data: audioData } = await supabase.storage.from('voice-notes').upload(audioPath, audioBlob, { contentType: 'audio/webm' });
          if (audioData) {
            const { data: urlData } = supabase.storage.from('voice-notes').getPublicUrl(audioData.path);
            voiceNoteUrl = urlData.publicUrl;
          }
        }
        if (cardData.voiceBgBase64) {
          const bgBlob = base64ToBlob(cardData.voiceBgBase64);
          const bgPath = `${session.user.id}/${Date.now()}-bg.jpg`;
          const { data: bgData } = await supabase.storage.from('voice-backgrounds').upload(bgPath, bgBlob, { contentType: 'image/jpeg' });
          if (bgData) {
            const { data: urlData } = supabase.storage.from('voice-backgrounds').getPublicUrl(bgData.path);
            voiceBgUrl = urlData.publicUrl;
          }
        }
      }

      const insertData: any = {
        user_id: session.user.id,
        plan,
        paid: false,
        product_type: productType,
        question: cardData.question || 'Will you go out with me?',
        yes_message: cardData.yesMessage || '',
        recipient_name: cardData.recipientName || null,
        sender_name: cardData.senderName || null,
      };

      if (productType === 'askout') {
        insertData.theme = cardData.theme || 'classic';
        insertData.no_button_trick = cardData.noButtonTrick || 'runaway';
        insertData.stickers = cardData.stickers || [];
      } else if (productType === 'bouquet') {
        insertData.bouquet_data = cardData.bouquetData || {};
      } else if (productType === 'voice') {
        insertData.voice_note_url = voiceNoteUrl;
        insertData.voice_background_image = voiceBgUrl;
        insertData.voice_duration = cardData.voiceDuration || 0;
      }

      const { data, error } = await supabase.from('cards').insert(insertData).select('id').single();

      if (error || !data || cancelled) {
        console.error('Failed to save', error);
        return;
      }

      localStorage.removeItem('pendingCard');
      localStorage.removeItem('pendingPlan');
      localStorage.removeItem('pendingProductType');

      const redirectUrl = `${window.location.origin}/success?card_id=${data.id}&product_type=${productType}`;
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: { cardId: data.id, plan, redirectUrl },
      });

      if (checkoutError || !checkoutData?.payment_link) {
        console.error('Failed to create checkout', checkoutError);
        return;
      }

      window.location.href = checkoutData.payment_link;
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-blush))] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-xl text-center space-y-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-5xl mx-auto w-fit">✨</motion.div>
          <h2 className="font-display text-2xl font-bold">Preparing your moment...</h2>
          <p className="text-muted-foreground">Redirecting to secure payment</p>
        </div>
      </motion.div>
    </div>
  );
};

function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export default Checkout;
