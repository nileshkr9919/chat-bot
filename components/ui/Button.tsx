"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}

export default function Button({ children, className = "", variant = "primary", ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-accent";
  const variants: Record<string, string> = {
    primary: "bg-accent text-on-accent hover:bg-accent-hover px-4 py-2",
    ghost: "bg-transparent text-app px-3 py-1 border border-transparent muted hover:opacity-90",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
