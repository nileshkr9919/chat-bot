"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getConversations, createConversation as dbCreateConversation, getConversationMessages, getOrCreateUserProfile } from "@/lib/database";
import type { Conversation, Message, PersonalityProfile } from "@/lib/types";

export default function useChat() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        setUserId(user.id);
        await getOrCreateUserProfile(user.id);
      } catch (error) {
        console.error("Error initializing user:", error);
        router.push("/sign-in");
      }
    };

    initializeUser();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const loadConversations = async () => {
      try {
        const convs = await getConversations(userId);
        setConversations(convs);

        if (convs.length > 0) {
          await loadConversation(convs[0]);
        } else {
          await createNewConversation();
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        await createNewConversation();
      }
    };

    loadConversations();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await fetch(`/api/profile?userId=${userId}`);
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const loadConversation = async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation);
      const msgs = await getConversationMessages(conversation.id);
      setMessages(msgs);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const createNewConversation = async () => {
    if (!userId) return;

    try {
      const newConv = await dbCreateConversation(userId);
      setCurrentConversation(newConv);
      setMessages([]);
      const convs = await getConversations(userId);
      setConversations(convs);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!currentConversation || !userId) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConversation.id,
          userId,
          userMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      const msgs = await getConversationMessages(currentConversation.id);
      setMessages(msgs);

      if (data.profileGenerated) {
        const res = await fetch(`/api/profile?userId=${userId}`);
        const profileData = await res.json();
        if (profileData.profile) setProfile(profileData.profile);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
