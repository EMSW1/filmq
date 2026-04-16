import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, X, SkipForward } from 'lucide-react';

const POPULAR_ACTORS = [
  'Tom Hanks', 'Leonardo DiCaprio', 'Margot Robbie', 'Denzel Washington',
  'Scarlett Johansson', 'Shah Rukh Khan', 'Cate Blanchett', 'Brad Pitt',
  'Song Kang-ho', 'Gal Gadot', 'Ryan Gosling', 'Zendaya',
];

export default function StepCast({ value, onChange }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Any favorite actors?</h2>
      <p className="text-sm text-muted-foreground mb-6">Search or pick from popular names</p>

      <div className="relative mb-6">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Type an actor's name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-muted/50 border-white/10 text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {POPULAR_ACTORS.map(actor => (
          <button
            key={actor}
            onClick={() => onChange(actor)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
              ${value === actor
                ? 'bg-primary/15 border-primary/50 text-primary'
                : 'glass-card border-white/5 text-muted-foreground hover:border-white/20'}`}
          >
            {actor}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-6 text-muted-foreground hover:text-foreground"
        onClick={() => onChange('')}
      >
        <SkipForward className="w-4 h-4 mr-2" />
        Skip this step
      </Button>
    </div>
  );
}