'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopNavbar } from './top-navbar';

interface AppShellProps {
  children: ReactNode;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
  onSearchChange?: (search: string) => void;
}

export function AppShell({
  children,
  onViewChange,
  currentView,
  onSearchChange,
}: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <TopNavbar
          onViewChange={onViewChange}
          currentView={currentView}
          onSearchChange={onSearchChange}
        />
        <main className="relative z-10 p-6">{children}</main>
      </div>
    </div>
  );
}
