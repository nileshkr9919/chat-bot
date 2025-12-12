import OpenAI from 'openai';
import type { ChatMessage, PersonalityProfile, PersonalityTrait } from './types';

const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

// Initialize client only in server/production environment
const client = typeof window === 'undefined' && process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.LLM_BASE_URL,
    })
  : null;

export async function generateChatResponse(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<{ content: string; stopReason: string }> {
  if (!client) {
    throw new Error('OpenAI client not initialized. Check API key and environment.');
  }

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful and friendly AI chatbot. Engage naturally with the user.',
      },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content in response from OpenAI');
  }

  return {
    content,
    stopReason: response.choices[0].finish_reason || 'unknown',
  };
}

export async function generatePersonalityProfile(
  messages: ChatMessage[]
): Promise<Omit<PersonalityProfile, 'id' | 'user_id' | 'conversation_id' | 'created_at' | 'updated_at'>> {
  if (!client) {
    throw new Error('OpenAI client not initialized. Check API key and environment.');
  }

  const conversationSummary = messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');

  const systemPrompt = `You are an expert psychologist and personality analyst. Based on the conversation provided, analyze the user's personality, interests, and communication style.

Provide a detailed personality profile in the following JSON format:
{
  "personality_traits": [
    {
      "trait": "trait name",
      "description": "detailed description",
      "evidence": ["quote or observation from conversation", ...]
    }
  ],
  "interests": ["interest1", "interest2", ...],
  "communication_style": "description of how they communicate",
  "detected_patterns": {
    "key_themes": ["theme1", "theme2"],
    "question_types": "what types of questions they ask",
    "emotional_tone": "overall emotional tone",
    "values_indicated": ["value1", "value2"]
  },
  "confidence_score": 0.75
}

Be insightful but conservative in your confidence score. Base it on the amount and consistency of evidence.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Please analyze this conversation and provide a personality profile:\n\n${conversationSummary}`,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content in response from OpenAI');
  }

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const profile = JSON.parse(jsonMatch[0]);
    return {
      personality_traits: profile.personality_traits || [],
      interests: profile.interests || [],
      communication_style: profile.communication_style || '',
      detected_patterns: profile.detected_patterns || {},
      confidence_score: profile.confidence_score || 0.5,
    };
  } catch (error) {
    console.error('Failed to parse personality profile:', error);
    return {
      personality_traits: [],
      interests: [],
      communication_style: 'Unable to analyze',
      detected_patterns: {},
      confidence_score: 0,
    };
  }
}

export function shouldGenerateProfile(messageCount: number, lastProfileGenerationMessageCount?: number): boolean {
  const minMessages = 5;
  const minMessagesSinceLastProfile = 10;

  if (messageCount < minMessages) return false;
  if (lastProfileGenerationMessageCount === undefined) return messageCount >= minMessages;

  return messageCount - lastProfileGenerationMessageCount >= minMessagesSinceLastProfile;
}

export async function generateProfileResponse(
  userInput: string,
  personalityProfile: any
): Promise<string> {
  if (!client) {
    throw new Error('OpenAI client not initialized. Check API key and environment.');
  }

  const profileSummary = `
User Personality Profile:
- Traits: ${personalityProfile.personality_traits.map((t: PersonalityTrait) => t.trait).join(', ')}
- Interests: ${personalityProfile.interests.join(', ')}
- Communication Style: ${personalityProfile.communication_style}
- Key Patterns: ${JSON.stringify(personalityProfile.detected_patterns.key_themes || [])}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: `You have analyzed the user's personality based on their conversation history. The user is now asking about themselves or requesting a profile summary. 
    
${profileSummary}

Provide a warm, insightful summary that helps them understand themselves better based on your analysis. Be encouraging and specific.`,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content in response from OpenAI');
  }

  return content;
}
