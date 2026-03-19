import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type PlanType = 'basic' | 'premium';
type ProductKind = 'card' | 'bouquet' | 'voice';

interface PlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (plan: PlanType) => void;
  product?: ProductKind;
}

const copyByProduct: Record<ProductKind, {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
}> = {
  card: {
    eyebrow: 'ONE-TIME UNLOCK',
    title: '$1.99',
    description: 'Create your card and get a private shareable link to send it instantly.',
    features: [
      'Your finished card',
      'Interactive yes / no experience',
      'Private shareable link',
      'Ready to send right away',
    ],
    cta: 'Continue to checkout',
  },
  bouquet: {
    eyebrow: 'ONE-TIME UNLOCK',
    title: '$1.99',
    description: 'Unlock this bouquet and get a private shareable link to send the full reveal.',
    features: [
      'Your finished bouquet design',
      'Presented in the bouquet viewer',
      'Private shareable link',
      'Ready to send right away',
    ],
    cta: 'Continue to checkout',
  },
  voice: {
    eyebrow: 'ONE-TIME UNLOCK',
    title: '$1.99',
    description: 'Unlock this voice note and get a private shareable link to send it beautifully.',
    features: [
      'Your recorded voice note',
      'Designed playback page',
      'Private shareable link',
      'Ready to send right away',
    ],
    cta: 'Continue to checkout',
  },
};

const PlanDialog = ({ open, onClose, onSelect, product = 'card' }: PlanDialogProps) => {
  const copy = copyByProduct[product];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-lg p-0 overflow-hidden border-border">
        <DialogHeader className="p-6 pb-4">
          <p className="font-mono-label text-muted-foreground text-center mb-1">{copy.eyebrow}</p>
          <DialogTitle className="font-display text-3xl text-center font-bold">{copy.title}</DialogTitle>
          <DialogDescription className="text-center text-sm mt-1">
            {copy.description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4">
          <ul className="space-y-3">
            {copy.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-warm-wine shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 pt-2">
          <Button
            onClick={() => onSelect('basic')}
            className="w-full rounded-full py-6 bg-foreground text-background hover:bg-foreground/90"
          >
            {copy.cta}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
