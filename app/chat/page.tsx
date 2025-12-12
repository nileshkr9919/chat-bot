'use client';

import React from 'react';
import Sidebar from '@/components/chat/Sidebar';
import Header from '@/components/chat/Header';
import ChatPanel from '@/components/chat/ChatPanel';
import ProfilePanel from '@/components/chat/ProfilePanel';
import useChat from '@/hooks/useChat';
import { PersonalityProfileCard } from '@/components/PersonalityProfileCard';
import { X } from 'lucide-react';

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
    isProfileOpen,
    setIsProfileOpen,
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

      <div className="flex-1 flex flex-col min-h-0">
        <Header onToggleProfile={() => setIsProfileOpen((v) => !v)} />

        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden items-stretch min-h-0">
          <ChatPanel messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
          <ProfilePanel profile={profile} isLoading={profileLoading} />
        </div>

        {/* Mobile Profile Slide-over */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 overlay-bg" onClick={() => setIsProfileOpen(false)} />
            <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-80 p-4">
              <div className="surface border border-surface rounded-lg h-full overflow-auto p-4 relative">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-accent text-on-accent hover:bg-accent-hover"
                  aria-label="Close profile"
                >
                  <X size={16} />
                </button>
                <PersonalityProfileCard profile={profile} isLoading={profileLoading} />
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 overlay-bg md:hidden z-30" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
}
