import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Bookmark, BookmarkCheck, Play, ExternalLink, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import MovieComments from './MovieComments';

export default function MovieDetailSheet({ movie, open, onClose, isInWatchlist, onToggleWatchlist }) {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&h=1170&fit=crop';

  const trailerUrl = movie.trailer_key
    ? `https://www.youtube.com/watch?v=${movie.trailer_key}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`;

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
      toast.success('Link copied!');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-background border-white/10 overflow-y-auto p-0">
        {/* Hero poster */}
        <div className="relative h-72 w-full">
          <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <SheetHeader className="text-left">
              <SheetTitle className="font-heading text-2xl font-black text-foreground leading-tight">
                {movie.title}
              </SheetTitle>
            </SheetHeader>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-heading font-bold text-primary">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{movie.release_date?.slice(0, 4)}</span>
              <span className="text-xs text-muted-foreground">{movie.original_language?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(trailerUrl, '_blank')}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-heading font-bold"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              Watch Trailer
            </Button>
            <Button
              variant="outline"
              className="h-11 w-11 rounded-xl border-white/10 bg-transparent p-0"
              onClick={() => onToggleWatchlist?.(movie)}
            >
              {isInWatchlist
                ? <BookmarkCheck className="w-5 h-5 text-primary" />
                : <Bookmark className="w-5 h-5 text-foreground" />}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-11 rounded-xl border-white/10 bg-transparent p-0"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </Button>
          </div>

          {/* Overview */}
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground mb-2">Synopsis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{movie.overview}</p>
          </div>

          {/* Streaming */}
          {movie.streaming_platforms?.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground mb-2">Where to Watch</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streaming_platforms.map(platform => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="border-white/10 text-foreground bg-muted/50 rounded-lg px-3 py-1"
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <MovieComments tmdbId={movie.id} movieTitle={movie.title} />
        </div>
      </SheetContent>
    </Sheet>
  );
}