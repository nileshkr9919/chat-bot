'use client';

import React from 'react';
import Sidebar from '@/components/chat/Sidebar';
import Header from '@/components/chat/Header';
import ChatPanel from '@/components/chat/ChatPanel';
import ProfilePanel from '@/components/chat/ProfilePanel';
import useChat from '@/hooks/useChat';
import { PersonalityProfileCard } from '@/components/PersonalityProfileCard';

export default function ChatPage() {
  const {
    userId,
    conversations,
    currentConversation,
    messages,
    profile,
    isLoading,
    profileLoading,
    isSidebarOpen,
    setIsSidebarOpen,
    loadConversation,
    createNewConversation,
    handleSendMessage,
  } = useChat();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-app text-app">
        <div className="text-center">
          <p className="muted mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-app text-app">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={loadConversation}
        onCreateConversation={createNewConversation}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex gap-6 p-6 overflow-hidden items-stretch">
          <ChatPanel messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
          <ProfilePanel profile={profile} isLoading={profileLoading} />
        </div>

        {/* Mobile Profile Panel */}
        <div className="lg:hidden p-4 surface border-t border-surface">
          <PersonalityProfileCard profile={profile} isLoading={profileLoading} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 overlay-bg md:hidden z-30" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
}
