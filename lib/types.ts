export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  messages?: Message[];
};

export type UserProfile = {
  id: string;
  created_at: string;
  updated_at: string;
  conversation_count: number;
  total_messages: number;
};

export type PersonalityTrait = {
  trait: string;
  description: string;
  evidence: string[];
};

export type PersonalityProfile = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  personality_traits: PersonalityTrait[];
  interests: string[];
  communication_style: string;
  detected_patterns: Record<string, unknown>;
  confidence_score: number;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
