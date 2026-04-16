import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingPulse({ text = 'Finding your perfect movies...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-primary/30 animate-ping absolute inset-0" />
        <div className="w-16 h-16 rounded-full glass-card-strong flex items-center justify-center relative">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">{text}</p>
    </div>
  );
}