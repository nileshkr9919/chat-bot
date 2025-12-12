"use client";

import React from "react";
import { Sparkles, User, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleProfile?: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleProfile, onToggleSidebar }: HeaderProps) {
  return (
    <header className="surface border-b border-surface p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* mobile sidebar button */}
        <button
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md bg-accent text-on-accent"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-xl font-semibold text-app">AI Chat Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* mobile profile button */}
        <button
          aria-label="Open profile"
          onClick={onToggleProfile}
          className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md bg-accent text-on-accent"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
