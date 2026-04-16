import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, Dice5, Globe, Sparkles } from 'lucide-react';
import { getTrendingMovies, getSurpriseMovie } from '@/lib/movieService';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MovieCard from '@/components/shared/MovieCard';
import MovieDetailSheet from '@/components/shared/MovieDetailSheet';
import LoadingPulse from '@/components/shared/LoadingPulse';
import GlassCard from '@/components/shared/GlassCard';
import SurpriseSection from '@/components/trends/SurpriseSection';
import { toast } from 'sonner';

const REGIONS = [
  { label: 'Global', emoji: '🌍' },
  { label: 'USA', emoji: '🇺🇸' },
  { label: 'Arab World', emoji: '🇸🇦' },
  { label: 'Europe', emoji: '🇪🇺' },
  { label: 'Asia', emoji: '🇰🇷' },
];

export default function Trends() {
  const [region, setRegion] = useState('Global');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['trending', region],
    queryFn: () => getTrendingMovies(region),
    staleTime: 1000 * 60 * 15,
  });

  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.WatchlistItem.list(),
  });

  const watchlistIds = new Set(watchlist.map(w => w.tmdb_id));

  const toggleWatchlist = async (movie) => {
    if (watchlistIds.has(movie.id)) {
      const item = watchlist.find(w => w.tmdb_id === movie.id);
      if (item) await base44.entities.WatchlistItem.delete(item.id);
      toast.success('Removed from watchlist');
    } else {
      await base44.entities.WatchlistItem.create({
        tmdb_id: movie.id, title: movie.title,
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        rating: movie.vote_average, year: movie.release_date?.slice(0, 4),
      });
      toast.success('Added to watchlist!');
    }
    queryClient.invalidateQueries({ queryKey: ['watchlist'] });
  };

  return (
    <div className="min-h-screen p-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Trending Now
        </h1>
        <p className="text-sm text-muted-foreground mt-1">What the world is watching</p>
      </div>

      {/* Surprise Me */}
      <SurpriseSection onToggleWatchlist={toggleWatchlist} watchlistIds={watchlistIds} />

      {/* Region Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {REGIONS.map(r => (
          <button
            key={r.label}
            onClick={() => setRegion(r.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${region === r.label
                ? 'bg-primary/15 border-primary/50 text-primary'
                : 'glass-card border-white/5 text-muted-foreground hover:border-white/20'}`}
          >
            <span>{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>

      {/* Trending List */}
      {isLoading ? (
        <LoadingPulse text="Loading trends..." />
      ) : (
        <div className="space-y-3 pb-4">
          {movies?.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={i}
              isInWatchlist={watchlistIds.has(movie.id)}
              onToggleWatchlist={toggleWatchlist}
              onViewDetails={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      )}

      <MovieDetailSheet
        movie={selectedMovie}
        open={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isInWatchlist={selectedMovie ? watchlistIds.has(selectedMovie.id) : false}
        onToggleWatchlist={toggleWatchlist}
      />
    </div>
  );
}