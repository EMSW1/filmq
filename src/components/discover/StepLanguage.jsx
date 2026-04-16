import React from 'react';
import { motion } from 'framer-motion';
import { LANGUAGE_MAP } from '@/lib/movieService';

const LANGUAGE_FLAGS = {
  'English': '🇺🇸', 'Hindi': '🇮🇳', 'Arabic': '🇸🇦', 'Turkish': '🇹🇷',
  'Korean': '🇰🇷', 'Japanese': '🇯🇵', 'French': '🇫🇷', 'Spanish': '🇪🇸',
  'German': '🇩🇪', 'Italian': '🇮🇹', 'Chinese': '🇨🇳', 'Portuguese': '🇧🇷',
};

export default function StepLanguage({ selected, onChange }) {
  const languages = Object.keys(LANGUAGE_MAP);

  const toggle = (lang) => {
    if (selected.includes(lang)) {
      onChange(selected.filter(l => l !== lang));
    } else {
      onChange([...selected, lang]);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Language preference?</h2>
      <p className="text-sm text-muted-foreground mb-6">Select one or more</p>

      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang, i) => {
          const isSelected = selected.includes(lang);
          return (
            <motion.button
              key={lang}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggle(lang)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 border
                ${isSelected
                  ? 'bg-primary/15 border-primary/50 shadow-[0_0_15px_rgba(255,180,50,0.1)]'
                  : 'glass-card border-white/5 hover:border-white/20'}`}
            >
              <span className="text-xl">{LANGUAGE_FLAGS[lang]}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {lang}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}