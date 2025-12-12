"use client";

import React from "react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import type { Message } from "@/lib/types";

interface ChatPanelProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatPanel({ messages, isLoading, onSendMessage }: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col surface rounded-lg card-shadow overflow-hidden">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
