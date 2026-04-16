import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const ERAS = [
  { label: 'Classic', range: '1970-1989', emoji: '🎬' },
  { label: '90s Gold', range: '1990-1999', emoji: '📼' },
  { label: '2000s', range: '2000-2009', emoji: '💿' },
  { label: '2010s', range: '2010-2019', emoji: '📱' },
  { label: '2020s', range: '2020-2026', emoji: '🚀' },
  { label: 'Any Era', range: 'any', emoji: '✨' },
];

export default function StepTimeEra({ value, onChange }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Which time period?</h2>
      <p className="text-sm text-muted-foreground mb-6">Pick your preferred era</p>

      <div className="grid grid-cols-2 gap-3">
        {ERAS.map((era, i) => (
          <motion.button
            key={era.range}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onChange(era.range)}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border text-left
              ${value === era.range
                ? 'bg-primary/15 border-primary/50 shadow-[0_0_20px_rgba(255,180,50,0.15)]'
                : 'glass-card border-white/5 hover:border-white/20'}`}
          >
            <span className="text-2xl">{era.emoji}</span>
            <div>
              <p className={`font-heading font-bold text-sm ${value === era.range ? 'text-primary' : 'text-foreground'}`}>
                {era.label}
              </p>
              <p className="text-xs text-muted-foreground">{era.range === 'any' ? 'All years' : era.range}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}