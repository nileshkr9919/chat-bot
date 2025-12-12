import { supabase } from './supabase';
import type { Conversation, Message, UserProfile, PersonalityProfile } from './types';

// User Profile Operations
export async function getOrCreateUserProfile(userId: string): Promise<UserProfile> {
  // Try to get existing profile
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId);

  if (existing?.length) {
    return existing[0];
  }

  // Create new profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{ id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Conversation Operations
export async function createConversation(
  userId: string,
  title?: string
): Promise<Conversation> {
  // Ensure the user profile exists to satisfy foreign key constraints
  await getOrCreateUserProfile(userId);
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        user_id: userId,
        title: title || `Conversation - ${new Date().toLocaleString()}`,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) throw error;
}

// Message Operations
export async function saveMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed: number = 0
): Promise<Message> {
  // Ensure the user profile exists before inserting the message
  await getOrCreateUserProfile(userId);
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        user_id: userId,
        role,
        content,
        tokens_used: tokensUsed,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getRecentMessages(userId: string, limit: number = 50): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Personality Profile Operations
export async function savePersonalityProfile(
  profile: Omit<PersonalityProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<PersonalityProfile> {
  const { data, error } = await supabase
    .from('personality_profiles')
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestPersonalityProfile(userId: string): Promise<PersonalityProfile | null> {
  const { data, error } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getUserPersonalityProfiles(userId: string): Promise<PersonalityProfile[]> {
  const { data, error } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Statistics
export async function updateUserStats(userId: string): Promise<void> {
  const { data: messages } = await supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  const messageCount = messages?.length || 0;
  const conversationCount = conversations?.length || 0;

  await supabase
    .from('user_profiles')
    .update({
      total_messages: messageCount,
      conversation_count: conversationCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}
