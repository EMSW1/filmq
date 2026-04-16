import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, strong, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl',
        strong ? 'glass-card-strong' : 'glass-card',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
    >
      {children}
    </div>
  );
}