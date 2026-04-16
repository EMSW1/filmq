import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Star, Trash2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/shared/GlassCard';
import { toast } from 'sonner';

export default function Watchlist() {
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => base44.entities.WatchlistItem.list('-created_date'),
  });

  const removeItem = useMutation({
    mutationFn: (id) => base44.entities.WatchlistItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
  });

  return (
    <div className="min-h-screen p-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary fill-primary" />
          My Watchlist
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{watchlist.length} movies saved</p>
      </div>

      {/* Empty State */}
      {!isLoading && watchlist.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full glass-card-strong flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-center font-medium">No movies saved yet</p>
          <p className="text-xs text-muted-foreground text-center mt-1">Discover movies and add them to your watchlist</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer-loading" />
          ))}
        </div>
      )}

      {/* List */}
      <div className="space-y-3 pb-4">
        <AnimatePresence>
          {watchlist.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex items-center gap-3 p-3">
                <img
                  src={item.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=300&fit=crop'}
                  alt={item.title}
                  className="w-16 h-22 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.year} {item.genre ? `• ${item.genre}` : ''}</p>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-xs font-bold text-primary">{item.rating?.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}