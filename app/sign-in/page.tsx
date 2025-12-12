'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getOrCreateUserProfile } from '@/lib/database';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // If already signed in, go to chat
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (user) {
          try {
            // Ensure a user_profiles row exists for this user
            await getOrCreateUserProfile(user.id);
          } catch (e) {
            // Log but don't block navigation; developer can inspect RLS config
            // eslint-disable-next-line no-console
            console.warn('Could not create user profile on sign-in', e);
          }
          router.push('/chat');
        }
      } catch (_) {
        // ignore
      }
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage('Check your email for the magic link to sign in.');
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || 'Error sending sign-in link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app text-app">
      <div className="w-full max-w-md surface p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm muted">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-accent text-white rounded px-4 py-2"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm muted">{message}</p>}
      </div>
    </div>
  );
}
