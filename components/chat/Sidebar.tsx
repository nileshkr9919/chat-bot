"use client";

import React from "react";
import type { Conversation } from "@/lib/types";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "../ui";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string | null;
  onSelectConversation: (c: Conversation) => void;
  onCreateConversation: () => void;
  isSidebarOpen?: boolean;
}

export default function Sidebar({ conversations, currentConversationId, onSelectConversation, onCreateConversation, isSidebarOpen = false }: SidebarProps) {
  return (
    <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 w-64 sidebar border-r border-surface transition-transform z-40 md:static md:translate-x-0`}>
      <div className="p-4 border-b">
        <Button onClick={onCreateConversation} className="w-full flex items-center justify-center">
          <Plus size={16} />
          <span className="ml-2">New Chat</span>
        </Button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${currentConversationId === conv.id ? 'bg-accent text-on-accent' : 'hover:opacity-95'}`}
          >
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <p className="text-xs muted">{new Date(conv.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
