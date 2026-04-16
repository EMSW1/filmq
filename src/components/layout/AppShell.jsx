import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Compass, Search, TrendingUp, Bookmark, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Compass, label: 'Discover' },
  { path: '/ai-search', icon: Sparkles, label: 'AI Search' },
  { path: '/trends', icon: TrendingUp, label: 'Trends' },
  { path: '/watchlist', icon: Bookmark, label: 'Watchlist' },
];

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen galaxy-bg flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-strong border-t border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'text-primary scale-105' 
                    : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_hsl(43,100%,55%)]' : ''}`} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <div className="absolute -bottom-0 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}