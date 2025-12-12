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
    <aside className="hidden lg:block w-80 overflow-y-auto">
      <PersonalityProfileCard profile={profile} isLoading={isLoading} />
    </aside>
  );
}
