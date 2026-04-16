import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dice5, Star, Play, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { getSurpriseMovie } from '@/lib/movieService';
import GlassCard from '@/components/shared/GlassCard';

const MOODS = ['Happy', 'Adventurous', 'Thoughtful', 'Thrilled', 'Romantic', 'Nostalgic'];

export default function SurpriseSection({ onToggleWatchlist, watchlistIds }) {
  const [loading, setLoading] = useState(false);
  const [surprise, setSurprise] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSurprise = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    const result = await getSurpriseMovie(mood);
    setSurprise(result);
    setLoading(false);
  };

  return (
    <GlassCard strong className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Dice5 className="w-5 h-5 text-accent" />
        <h3 className="font-heading font-bold text-foreground">Surprise Me!</h3>
      </div>

      {!surprise && !loading && (
        <>
          <p className="text-xs text-muted-foreground mb-3">Pick your mood and get an instant pick</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(mood => (
              <button
                key={mood}
                onClick={() => handleSurprise(mood)}
                className="px-3 py-1.5 rounded-full glass-card border border-white/5 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {mood}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <AnimatePresence>
        {surprise && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex gap-3">
              <img
                src={surprise.movie?.poster_path
                  ? `https://image.tmdb.org/t/p/w200${surprise.movie.poster_path}`
                  : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=300&fit=crop'}
                alt={surprise.movie?.title}
                className="w-20 h-28 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-foreground text-sm truncate">{surprise.movie?.title}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary">{surprise.movie?.vote_average?.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground ml-1">{surprise.movie?.release_date?.slice(0, 4)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{surprise.reason}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs rounded-lg bg-primary text-primary-foreground"
                    onClick={() => {
                      const url = surprise.movie?.trailer_key
                        ? `https://www.youtube.com/watch?v=${surprise.movie.trailer_key}`
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(surprise.movie?.title + ' trailer')}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <Play className="w-3 h-3 mr-1 fill-current" /> Trailer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => onToggleWatchlist?.(surprise.movie)}
                  >
                    {watchlistIds?.has(surprise.movie?.id)
                      ? <BookmarkCheck className="w-3 h-3 text-primary" />
                      : <Bookmark className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <button
                onClick={() => { setSurprise(null); setSelectedMood(null); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}