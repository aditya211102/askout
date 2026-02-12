import { motion } from 'framer-motion';
import { Crown, Sparkles, Check } from 'lucide-react';
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
    icon: <Sparkles className="w-6 h-6" />,
    features: ['All themes', '4 button tricks', 'Shareable link', 'Basic stickers'],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'premium' as PlanType,
    name: 'Premium',
    price: '$3.99',
    icon: <Crown className="w-6 h-6" />,
    features: ['Everything in Basic', 'Premium themes', 'Premium stickers', 'Priority support'],
    gradient: 'from-amber-500 to-yellow-400',
    popular: true,
  },
];

const PlanDialog = ({ open, onClose, onSelect }: PlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-border">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-display text-2xl text-center">Choose Your Plan 💖</DialogTitle>
          <DialogDescription className="text-center">Pick a plan to share your card</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 p-6 pt-2">
          {plans.map((plan) => (
            <motion.button
              key={plan.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(plan.id)}
              className={`relative p-5 rounded-2xl border-2 border-border text-left hover:border-primary/40 transition-all ${
                plan.popular ? 'ring-2 ring-primary/30' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold">
                  POPULAR
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-3`}>
                {plan.icon}
              </div>
              <div className="font-display text-lg font-bold">{plan.name}</div>
              <div className="text-2xl font-bold text-foreground my-1">{plan.price}</div>
              <ul className="space-y-1.5 mt-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
