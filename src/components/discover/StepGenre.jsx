import React from 'react';
import { motion } from 'framer-motion';
import { GENRE_MAP } from '@/lib/movieService';
import { Swords, Drama, Ghost, Laugh, Heart, Atom, Baby, Compass, Music, Film, Search, Skull, Clapperboard, Gamepad2, History, Castle } from 'lucide-react';

const GENRE_ICONS = {
  'Action': Swords, 'Adventure': Compass, 'Animation': Baby, 'Comedy': Laugh,
  'Crime': Skull, 'Documentary': Film, 'Drama': Drama, 'Family': Baby,
  'Fantasy': Castle, 'History': History, 'Horror': Ghost, 'Music': Music,
  'Mystery': Search, 'Romance': Heart, 'Sci-Fi': Atom, 'Thriller': Gamepad2,
  'War': Swords, 'Western': Clapperboard,
};

export default function StepGenre({ selected, onChange }) {
  const genres = Object.keys(GENRE_MAP);

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      onChange(selected.filter(g => g !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">What are you in the mood for?</h2>
      <p className="text-sm text-muted-foreground mb-6">Pick one or more genres</p>
      <div className="grid grid-cols-3 gap-3">
        {genres.map((genre, i) => {
          const Icon = GENRE_ICONS[genre] || Film;
          const isSelected = selected.includes(genre);
          return (
            <motion.button
              key={genre}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => toggleGenre(genre)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 border
                ${isSelected
                  ? 'bg-primary/15 border-primary/50 text-primary shadow-[0_0_20px_rgba(255,180,50,0.15)]'
                  : 'glass-card border-white/5 text-muted-foreground hover:border-white/20'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{genre}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}