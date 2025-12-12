"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isSending || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsSending(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="border-t border-surface surface p-4">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isSending || isLoading}
          rows={1}
          className="flex-1 resize-none border border-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent bg-app text-app disabled:opacity-60"
        />
        <Button onClick={handleSend} disabled={!input.trim() || isSending || isLoading} className="flex items-center gap-2">
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
