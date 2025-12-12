"use client";

import React from 'react';
import type { PersonalityProfile, PersonalityTrait } from '@/lib/types';
import { User, Sparkles } from 'lucide-react';
import { Card } from './ui';

interface PersonalityProfileCardProps {
  profile: PersonalityProfile | null;
  isLoading?: boolean;
}

export function PersonalityProfileCard({ profile, isLoading }: PersonalityProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-accent" />
          <h3 className="text-lg font-semibold text-app">Generating your profile...</h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 muted-bg rounded animate-pulse"></div>
          <div className="h-4 muted-bg rounded animate-pulse w-5/6"></div>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 muted">
          <User size={18} />
          <p className="text-sm">Chat more to generate your personality profile!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-accent" />
          <h3 className="text-lg font-semibold text-app">Your Profile</h3>
        </div>
        <p className="text-xs muted">Confidence: {(profile.confidence_score * 100).toFixed(0)}%</p>
      </div>

      {profile.personality_traits.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-app mb-2">Key Traits</h4>
          <div className="space-y-2">
            {profile.personality_traits.slice(0, 3).map((trait: PersonalityTrait, idx) => (
              <div key={idx} className="surface rounded p-3 card-shadow">
                <p className="font-medium text-sm text-app">{trait.trait}</p>
                <p className="text-xs muted mt-1">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.interests.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-app mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 5).map((interest, idx) => (
              <span key={idx} className="bg-accent text-on-accent text-xs px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.communication_style && (
        <div>
          <h4 className="text-sm font-semibold text-app mb-2">Communication Style</h4>
          <p className="text-sm text-app surface rounded p-2">{profile.communication_style}</p>
        </div>
      )}
    </Card>
  );
}
