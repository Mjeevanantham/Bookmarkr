'use client';

import { Grid, List, Search, User } from 'lucide-react';
import { useState } from 'react';

interface TopNavbarProps {
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
  onSearchChange?: (search: string) => void;
}

export function TopNavbar({
  onViewChange,
  currentView = 'grid',
  onSearchChange,
}: TopNavbarProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => onViewChange?.('grid')}
              className={`rounded p-1.5 transition-all ${
                currentView === 'grid'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange?.('list')}
              className={`rounded p-1.5 transition-all ${
                currentView === 'list'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-white/60 hover:text-white'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* User Avatar */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-all hover:scale-105">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
