import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { discoverMovies } from '@/lib/movieService';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MovieCard from '@/components/shared/MovieCard';
import LoadingPulse from '@/components/shared/LoadingPulse';
import MovieDetailSheet from '@/components/shared/MovieDetailSheet';
import { toast } from 'sonner';

export default function Results() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filters = JSON.parse(localStorage.getItem('filmq_filters') || '{}');

  const { data: movies, isLoading, refetch } = useQuery({
    queryKey: ['discover', JSON.stringify(filters)],
    queryFn: () => discoverMovies(filters),
    staleTime: 1000 * 60 * 5,
  });

  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.WatchlistItem.list(),
  });

  const watchlistIds = new Set(watchlist.map(w => w.tmdb_id));

  const addToWatchlist = useMutation({
    mutationFn: (movie) => base44.entities.WatchlistItem.create({
      tmdb_id: movie.id,
      title: movie.title,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      rating: movie.vote_average,
      year: movie.release_date?.slice(0, 4),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Added to watchlist!');
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (movie) => {
      const item = watchlist.find(w => w.tmdb_id === movie.id);
      if (item) await base44.entities.WatchlistItem.delete(item.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
  });

  const toggleWatchlist = (movie) => {
    if (watchlistIds.has(movie.id)) {
      removeFromWatchlist.mutate(movie);
    } else {
      addToWatchlist.mutate(movie);
    }
  };

  if (!filters.genres?.length) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen p-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Top Picks
          </h1>
          <p className="text-xs text-muted-foreground">
            {filters.genres?.join(', ')} • {filters.yearRange}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          className="text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingPulse />
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
          {(!movies || movies.length === 0) && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No movies found. Try adjusting your filters.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Start Over
              </Button>
            </div>
          )}
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