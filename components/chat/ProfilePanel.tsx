"use client";

import React from "react";
import { PersonalityProfileCard } from "@/components/PersonalityProfileCard";
import type { PersonalityProfile } from "@/lib/types";

interface ProfilePanelProps {
  profile: PersonalityProfile | null;
  isLoading?: boolean;
}

export default function ProfilePanel({ profile, isLoading }: ProfilePanelProps) {
  return (
    <aside className="hidden md:block w-80 overflow-y-auto min-h-0">
      <PersonalityProfileCard profile={profile} isLoading={isLoading} />
    </aside>
  );
}
