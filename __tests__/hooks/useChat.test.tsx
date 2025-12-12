import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));


// Mock supabase and database modules without referencing hoisted variables
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

vi.mock('@/lib/database', () => ({
  getConversations: vi.fn(),
  createConversation: vi.fn(),
  getConversationMessages: vi.fn(),
  getOrCreateUserProfile: vi.fn(),
}));

import useChat from '@/hooks/useChat';

function TestComponent() {
  const hook = useChat();
  return (
    <div>
      <span data-testid="userId">{hook.userId}</span>
      <span data-testid="convs">{hook.conversations.length}</span>
    </div>
  );
}

describe('useChat hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes user and creates conversation when none exist', async () => {
    // import the mocked modules so we can set expectations on the mocks
    const supabaseModule = await import('@/lib/supabase');
    const db = await import('@/lib/database');

    (supabaseModule.supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: 'user-1' } } });
    (db.getConversations as any).mockResolvedValue([]);
    (db.createConversation as any).mockResolvedValue({ id: 'conv-1', user_id: 'user-1', title: 'New Chat', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    (db.getConversationMessages as any).mockResolvedValue([]);
    (db.getOrCreateUserProfile as any).mockResolvedValue({});
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ profile: null }) });

    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('userId').textContent).toBe('user-1'));

    // createConversation should have been called because getConversations returned []
    expect((db.createConversation as any)).toHaveBeenCalled();
  });
});
