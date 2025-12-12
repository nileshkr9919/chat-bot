"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`surface border border-surface rounded-lg p-4 ${className} card-shadow`}>
      {children}
    </div>
  );
}
