import React from 'react';
import { Star, Play, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MovieCard({ movie, onToggleWatchlist, isInWatchlist, onViewDetails, rank }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop';

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Check out "${movie.title}" on FilmQ!`,
      url: `https://www.themoviedb.org/movie/${movie.id}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank ? rank * 0.1 : 0 }}
    >
      <GlassCard className="overflow-hidden group" onClick={onViewDetails}>
        <div className="flex gap-4 p-3">
          {/* Poster */}
          <div className="relative flex-shrink-0 w-28 h-40 rounded-xl overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {rank !== undefined && (
              <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-heading font-bold text-sm w-7 h-7 flex items-center justify-center rounded-br-xl">
                {rank + 1}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
            <div>
              <h3 className="font-heading font-bold text-foreground text-base leading-tight truncate">
                {movie.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {movie.release_date?.slice(0, 4)} • {movie.original_language?.toUpperCase()}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-heading font-bold text-primary text-sm">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({movie.vote_count?.toLocaleString()})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie); }}
              >
                {isInWatchlist
                  ? <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                  : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}