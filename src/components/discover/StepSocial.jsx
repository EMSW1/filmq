import React from 'react';
import { motion } from 'framer-motion';

const CONTEXTS = [
  { label: 'Alone', value: 'Alone', emoji: '🎧', desc: 'Deep dives & personal picks' },
  { label: 'With Friends', value: 'With Friends', emoji: '🍿', desc: 'Fun & exciting vibes' },
  { label: 'Family', value: 'Family', emoji: '👨‍👩‍👧‍👦', desc: 'Everyone-friendly content' },
];

export default function StepSocial({ value, onChange }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Who are you watching with?</h2>
      <p className="text-sm text-muted-foreground mb-6">This helps us pick the right vibe</p>

      <div className="space-y-3">
        {CONTEXTS.map((ctx, i) => (
          <motion.button
            key={ctx.value}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onChange(ctx.value)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 border text-left
              ${value === ctx.value
                ? 'bg-primary/15 border-primary/50 shadow-[0_0_20px_rgba(255,180,50,0.15)]'
                : 'glass-card border-white/5 hover:border-white/20'}`}
          >
            <span className="text-3xl">{ctx.emoji}</span>
            <div>
              <p className={`font-heading font-bold ${value === ctx.value ? 'text-primary' : 'text-foreground'}`}>
                {ctx.label}
              </p>
              <p className="text-sm text-muted-foreground">{ctx.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}