import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Eye, EyeOff, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from './GlassCard';

const SPOILER_WORDS = ['dies', 'death', 'killed', 'ending', 'twist', 'spoiler', 'turns out', 'reveal', 'final scene'];

function checkSpoiler(text) {
  const lower = text.toLowerCase();
  return SPOILER_WORDS.some(word => lower.includes(word));
}

export default function MovieComments({ tmdbId, movieTitle }) {
  const [newComment, setNewComment] = useState('');
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', tmdbId],
    queryFn: () => base44.entities.MovieComment.filter({ tmdb_id: tmdbId }, '-created_date', 50),
  });

  const addComment = useMutation({
    mutationFn: (text) => {
      const isSpoiler = checkSpoiler(text);
      return base44.entities.MovieComment.create({
        tmdb_id: tmdbId,
        movie_title: movieTitle,
        text,
        is_spoiler: isSpoiler,
        likes: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', tmdbId] });
      setNewComment('');
      toast.success('Comment posted!');
    },
  });

  const likeComment = useMutation({
    mutationFn: (comment) => base44.entities.MovieComment.update(comment.id, { likes: (comment.likes || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', tmdbId] }),
  });

  const toggleSpoiler = (id) => {
    const next = new Set(revealedSpoilers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedSpoilers(next);
  };

  return (
    <div>
      <h3 className="font-heading font-bold text-sm text-foreground mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        Comments ({comments.length})
      </h3>

      {/* Add comment */}
      <div className="flex gap-2 mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="bg-muted/50 border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl text-sm min-h-[44px] resize-none"
          rows={1}
        />
        <Button
          size="icon"
          disabled={!newComment.trim()}
          onClick={() => addComment.mutate(newComment.trim())}
          className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-2">
        {comments.map(comment => {
          const isRevealed = revealedSpoilers.has(comment.id);
          return (
            <GlassCard key={comment.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{comment.created_by || 'Anonymous'}</p>
                  {comment.is_spoiler && !isRevealed ? (
                    <button
                      onClick={() => toggleSpoiler(comment.id)}
                      className="flex items-center gap-2 text-xs text-destructive"
                    >
                      <EyeOff className="w-3 h-3" />
                      Spoiler alert — tap to reveal
                    </button>
                  ) : (
                    <p className="text-sm text-foreground">{comment.text}</p>
                  )}
                  {comment.is_spoiler && isRevealed && (
                    <button
                      onClick={() => toggleSpoiler(comment.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground mt-1"
                    >
                      <Eye className="w-3 h-3" /> Hide spoiler
                    </button>
                  )}
                </div>
                <button
                  onClick={() => likeComment.mutate(comment)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  {comment.likes || 0}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}