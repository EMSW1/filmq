import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const DURATIONS = [
  { label: 'Quick Watch', value: '~1h30', desc: '~90 minutes', icon: '⚡' },
  { label: 'Standard', value: '~2h', desc: '~120 minutes', icon: '🎬' },
  { label: 'Epic', value: '~2h30+', desc: '150+ minutes', icon: '🎭' },
];

export default function StepDuration({ value, onChange }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">How long?</h2>
      <p className="text-sm text-muted-foreground mb-6">Choose your ideal movie length</p>

      <div className="space-y-3">
        {DURATIONS.map((dur, i) => (
          <motion.button
            key={dur.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onChange(dur.value)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 border text-left
              ${value === dur.value
                ? 'bg-primary/15 border-primary/50 shadow-[0_0_20px_rgba(255,180,50,0.15)]'
                : 'glass-card border-white/5 hover:border-white/20'}`}
          >
            <span className="text-3xl">{dur.icon}</span>
            <div>
              <p className={`font-heading font-bold ${value === dur.value ? 'text-primary' : 'text-foreground'}`}>
                {dur.label}
              </p>
              <p className="text-sm text-muted-foreground">{dur.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}