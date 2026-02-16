import { motion } from 'framer-motion';
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

const plans = [
  {
    id: 'basic' as PlanType,
    name: 'Basic',
    price: '$2.99',
    features: ['All themes', 'All tricks', 'Shareable link', 'Basic stickers'],
  },
  {
    id: 'premium' as PlanType,
    name: 'Premium',
    price: '$3.99',
    features: ['Everything in Basic', 'Premium themes', 'Premium stickers', 'Priority delivery'],
    popular: true,
  },
];

const PlanDialog = ({ open, onClose, onSelect }: PlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-lg p-0 overflow-hidden border-border">
        <DialogHeader className="p-6 pb-2">
          <p className="font-mono-label text-muted-foreground text-center mb-1">Pricing</p>
          <DialogTitle className="font-display text-2xl text-center font-bold">Choose a plan</DialogTitle>
          <DialogDescription className="text-center text-sm">One-time payment. No subscriptions.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 p-6 pt-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`relative p-5 rounded-lg border text-left hover:border-foreground/40 transition-all ${
                plan.popular ? 'border-foreground' : 'border-border'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 font-mono-label text-[9px] bg-foreground text-background px-2 py-0.5 rounded-full">
                  POPULAR
                </span>
              )}
              <div className="font-medium text-sm mb-1">{plan.name}</div>
              <div className="text-2xl font-bold text-foreground mb-4">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-warm-wine shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
