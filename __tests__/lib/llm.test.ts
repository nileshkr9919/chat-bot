import { describe, it, expect } from 'vitest';
import { shouldGenerateProfile } from '@/lib/llm';
import type { ChatMessage } from '@/lib/types';

describe('LLM Module', () => {
  describe('shouldGenerateProfile', () => {
    it('should return false for messages less than minimum', () => {
      expect(shouldGenerateProfile(3)).toBe(false);
      expect(shouldGenerateProfile(4)).toBe(false);
    });

    it('should return true when message count reaches minimum', () => {
      expect(shouldGenerateProfile(5)).toBe(true);
      expect(shouldGenerateProfile(10)).toBe(true);
    });

    it('should check minimum messages since last profile generation', () => {
      expect(shouldGenerateProfile(20, 10)).toBe(true);  // 20 - 10 = 10, meets minimum
      expect(shouldGenerateProfile(19, 10)).toBe(false);  // 19 - 10 = 9, below minimum
      expect(shouldGenerateProfile(25, 5)).toBe(true);   // 25 - 5 = 20, exceeds minimum
    });

    it('should handle edge cases correctly', () => {
      // Exactly at minimum
      expect(shouldGenerateProfile(5, undefined)).toBe(true);
      
      // Just below minimum
      expect(shouldGenerateProfile(4, undefined)).toBe(false);
      
      // At minimum since last profile
      expect(shouldGenerateProfile(15, 5)).toBe(true);
    });
  });

  describe('Chat message validation', () => {
    it('should validate message structure', () => {
      const message: ChatMessage = {
        role: 'user',
        content: 'Hello, how are you?',
      };

      expect(message.role).toBe('user');
      expect(typeof message.content).toBe('string');
      expect(message.content.length).toBeGreaterThan(0);
    });

    it('should support assistant role', () => {
      const message: ChatMessage = {
        role: 'assistant',
        content: 'I am doing well, thank you!',
      };

      expect(message.role).toBe('assistant');
    });

    it('should handle multiple messages in sequence', () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'What is AI?' },
        { role: 'assistant', content: 'AI is artificial intelligence.' },
        { role: 'user', content: 'Can you explain more?' },
        { role: 'assistant', content: 'Of course! AI refers to...' },
      ];

      expect(messages.length).toBe(4);
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
      messages.forEach((msg) => {
        expect(typeof msg.content).toBe('string');
        expect(msg.content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Profile generation thresholds', () => {
    it('should track sufficient messages for accuracy', () => {
      const minMessagesForProfile = 5;
      
      // With minimum messages
      expect(shouldGenerateProfile(minMessagesForProfile)).toBe(true);
      
      // With plenty of context
      expect(shouldGenerateProfile(50)).toBe(true);
    });

    it('should require enough messages since last generation', () => {
      expect(shouldGenerateProfile(15, 5)).toBe(true);
      expect(shouldGenerateProfile(14, 5)).toBe(false);
    });

    it('should handle first profile generation', () => {
      // No previous profile
      expect(shouldGenerateProfile(5, undefined)).toBe(true);
      expect(shouldGenerateProfile(4, undefined)).toBe(false);
    });
  });
});
