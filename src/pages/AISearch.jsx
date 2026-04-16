import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Wand2, Lightbulb } from 'lucide-react';
import { aiSearchMovies } from '@/lib/movieService';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MovieCard from '@/components/shared/MovieCard';
import MovieDetailSheet from '@/components/shared/MovieDetailSheet';
import LoadingPulse from '@/components/shared/LoadingPulse';
import GlassCard from '@/components/shared/GlassCard';
import { toast } from 'sonner';

const SUGGESTIONS = [
  'A quiet romantic movie set in nature',
  'Mind-bending sci-fi like Inception',
  'Feel-good comedy for a rainy day',
  'Dark thriller with unexpected twists',
  'Anime movie with beautiful animation',
  'Based on a true story, inspiring',
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ['ai-search', searchQuery],
    queryFn: () => aiSearchMovies(searchQuery),
    enabled: !!searchQuery,
    staleTime: 1000 * 60 * 10,
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

  const handleSearch = () => {
    if (query.trim()) setSearchQuery(query.trim());
  };

  return (
    <div className="min-h-screen p-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Movie Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Describe what you want to watch</p>
      </div>

      {/* Search Input */}
      <GlassCard strong className="p-4 mb-6">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., I want a quiet romantic movie set in nature with beautiful cinematography..."
          className="bg-transparent border-none text-foreground placeholder:text-muted-foreground resize-none text-sm p-0 focus-visible:ring-0 min-h-[80px]"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="rounded-xl bg-primary text-primary-foreground font-heading font-bold px-6"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </GlassCard>

      {/* Suggestions */}
      {!searchQuery && !isLoading && (
        <div>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Try these
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); setSearchQuery(s); }}
                className="px-3 py-1.5 rounded-full glass-card border border-white/5 text-xs text-muted-foreground hover:text-foreground hover:border-white/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingPulse text="AI is thinking..." />}

      {/* Results */}
      {result && !isLoading && (
        <div>
          {result.intent_summary && (
            <GlassCard className="p-3 mb-4">
              <p className="text-xs text-primary font-medium">
                <Sparkles className="w-3 h-3 inline mr-1" />
                {result.intent_summary}
              </p>
            </GlassCard>
          )}
          <div className="space-y-3 pb-4">
            {result.movies?.map((movie, i) => (
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