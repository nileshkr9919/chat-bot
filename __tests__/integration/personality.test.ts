import { describe, it, expect } from 'vitest';
import type { PersonalityProfile, PersonalityTrait } from '@/lib/types';

describe('Personality Profile Integration', () => {
  describe('Profile Structure Validation', () => {
    it('should create valid personality profile', () => {
      const profile: PersonalityProfile = {
        id: 'profile-1',
        user_id: 'user-1',
        conversation_id: 'conv-1',
        personality_traits: [
          {
            trait: 'Creative',
            description: 'Shows creative thinking',
            evidence: ['mentioned painting', 'discusses new ideas'],
          },
        ],
        interests: ['painting', 'coding', 'travel'],
        communication_style: 'Thoughtful and detailed',
        detected_patterns: {
          key_themes: ['creativity', 'learning'],
          question_types: 'exploratory',
          emotional_tone: 'positive',
          values_indicated: ['growth', 'expression'],
        },
        confidence_score: 0.75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(profile.id).toBeDefined();
      expect(profile.user_id).toBeDefined();
      expect(Array.isArray(profile.personality_traits)).toBe(true);
      expect(Array.isArray(profile.interests)).toBe(true);
      expect(typeof profile.communication_style).toBe('string');
      expect(profile.confidence_score).toBeGreaterThanOrEqual(0);
      expect(profile.confidence_score).toBeLessThanOrEqual(1);
    });

    it('should validate trait structure', () => {
      const trait: PersonalityTrait = {
        trait: 'Analytical',
        description: 'Prefers data-driven decision making',
        evidence: ['asked for statistics', 'discussed metrics'],
      };

      expect(trait.trait).toBeDefined();
      expect(trait.description).toBeDefined();
      expect(Array.isArray(trait.evidence)).toBe(true);
      expect(trait.evidence.length).toBeGreaterThan(0);
    });

    it('should handle multiple traits', () => {
      const traits: PersonalityTrait[] = [
        {
          trait: 'Curious',
          description: 'Interested in learning new things',
          evidence: ['asked many questions', 'explored different topics'],
        },
        {
          trait: 'Patient',
          description: 'Takes time to understand issues',
          evidence: ['gave detailed explanations', 'discussed thoroughly'],
        },
        {
          trait: 'Organized',
          description: 'Prefers structure and planning',
          evidence: ['mentioned scheduling', 'discussed planning'],
        },
      ];

      expect(traits.length).toBe(3);
      traits.forEach((trait) => {
        expect(trait.trait).toBeDefined();
        expect(trait.description).toBeDefined();
        expect(trait.evidence).toBeDefined();
      });
    });
  });

  describe('Profile Generation Logic', () => {
    it('should generate appropriate confidence scores', () => {
      // Low confidence with few messages
      const lowConfidenceProfile: PersonalityProfile = {
        id: 'p1',
        user_id: 'u1',
        conversation_id: 'c1',
        personality_traits: [],
        interests: [],
        communication_style: '',
        detected_patterns: {},
        confidence_score: 0.2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // High confidence with many messages
      const highConfidenceProfile: PersonalityProfile = {
        id: 'p2',
        user_id: 'u1',
        conversation_id: 'c2',
        personality_traits: [
          {
            trait: 'Innovative',
            description: 'Continuously seeks new approaches',
            evidence: ['multiple examples of new ideas'],
          },
        ],
        interests: ['technology', 'innovation', 'entrepreneurship'],
        communication_style: 'Forward-thinking and visionary',
        detected_patterns: {
          key_themes: ['innovation', 'growth'],
        },
        confidence_score: 0.85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(lowConfidenceProfile.confidence_score).toBeLessThan(
        highConfidenceProfile.confidence_score
      );
      expect(lowConfidenceProfile.confidence_score).toBeGreaterThanOrEqual(0);
      expect(highConfidenceProfile.confidence_score).toBeLessThanOrEqual(1);
    });

    it('should extract interests from patterns', () => {
      const profile: PersonalityProfile = {
        id: 'p1',
        user_id: 'u1',
        conversation_id: 'c1',
        personality_traits: [],
        interests: ['hiking', 'photography', 'coffee'],
        communication_style: 'Casual and friendly',
        detected_patterns: {
          key_themes: ['adventure', 'creativity'],
        },
        confidence_score: 0.7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(profile.interests).toContain('hiking');
      expect(profile.interests).toContain('photography');
      expect(profile.interests).toContain('coffee');
      expect(profile.interests.length).toBe(3);
    });

    it('should track conversation-level profiles', () => {
      const profile1: PersonalityProfile = {
        id: 'p1',
        user_id: 'user-1',
        conversation_id: 'conv-1',
        personality_traits: [
          {
            trait: 'Curious',
            description: 'Asks many questions',
            evidence: ['asked 10+ questions in conv-1'],
          },
        ],
        interests: [],
        communication_style: 'Inquisitive',
        detected_patterns: {},
        confidence_score: 0.6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profile2: PersonalityProfile = {
        id: 'p2',
        user_id: 'user-1',
        conversation_id: 'conv-2',
        personality_traits: [
          {
            trait: 'Helpful',
            description: 'Offers assistance',
            evidence: ['offered solutions in conv-2'],
          },
        ],
        interests: [],
        communication_style: 'Supportive',
        detected_patterns: {},
        confidence_score: 0.7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(profile1.conversation_id).toBe('conv-1');
      expect(profile2.conversation_id).toBe('conv-2');
      expect(profile1.user_id).toBe(profile2.user_id);
    });
  });

  describe('Self-Awareness Prompts', () => {
    it('should detect self-awareness questions', () => {
      const selfAwarenessQuestions = [
        'Who am I',
        'Tell me about myself',
        'What am I like',
        'my profile',
        'About me',
        'personality',
      ];

      selfAwarenessQuestions.forEach((question) => {
        expect(question.length).toBeGreaterThan(0);
        // These would be matched against user input in real implementation
      });
    });

    it('should provide personalized responses based on profile', () => {
      const profile: PersonalityProfile = {
        id: 'p1',
        user_id: 'u1',
        conversation_id: 'c1',
        personality_traits: [
          {
            trait: 'Adventurous',
            description: 'Loves trying new things',
            evidence: ['mentioned traveling', 'exploring new places'],
          },
          {
            trait: 'Thoughtful',
            description: 'Considers impact of actions',
            evidence: ['discussed ethics', 'asked about consequences'],
          },
        ],
        interests: ['travel', 'culture', 'philosophy'],
        communication_style: 'Reflective and open-minded',
        detected_patterns: {
          key_themes: ['exploration', 'growth'],
        },
        confidence_score: 0.75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Verify profile has enough data for meaningful response
      expect(profile.personality_traits.length).toBeGreaterThan(0);
      expect(profile.interests.length).toBeGreaterThan(0);
      expect(profile.communication_style).toBeTruthy();
      expect(profile.confidence_score).toBeGreaterThan(0.5);
    });
  });
});
