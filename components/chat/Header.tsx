"use client";

import React from "react";

export default function Header() {
  return (
    <header className="surface border-b border-surface p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-app">AI Chat Assistant</h1>
      <div className="w-8" />
    </header>
  );
}
