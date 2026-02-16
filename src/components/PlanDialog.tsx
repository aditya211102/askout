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

interface PlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (plan: PlanType) => void;
}

const features = [
  'All themes & stickers',
  'All button tricks',
  'Shareable link',
  'All flower illustrations',
  'Voice messages up to 60s',
  'Priority delivery',
];

const PlanDialog = ({ open, onClose, onSelect }: PlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-lg p-0 overflow-hidden border-border">
        <DialogHeader className="p-6 pb-4">
          <p className="font-mono-label text-muted-foreground text-center mb-1">One-time</p>
          <DialogTitle className="font-display text-3xl text-center font-bold">$2.99</DialogTitle>
          <DialogDescription className="text-center text-sm mt-1">
            No subscriptions. Pay once, share forever.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4">
          <ul className="space-y-3">
            {features.map((f) => (
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
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
