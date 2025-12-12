import { NextRequest, NextResponse } from 'next/server';
import {
  getConversationMessages,
  saveMessage,
  getLatestPersonalityProfile,
  savePersonalityProfile,
  updateConversationTitle,
} from '@/lib/database';
import {
  generateChatResponse,
  generatePersonalityProfile,
  shouldGenerateProfile,
  generateProfileResponse,
  generateChatResponseStream,
} from '@/lib/llm';
import type { ChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId, userMessage } = await request.json();

    if (!conversationId || !userId || !userMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save user message
    await saveMessage(conversationId, userId, 'user', userMessage);

    // Get conversation history
    const messages = await getConversationMessages(conversationId);
    const chatHistory: ChatMessage[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Check if user is asking about themselves
    const lowerMessage = userMessage.toLowerCase();
    const isAskingAboutSelf =
      lowerMessage.includes('who am i') ||
      lowerMessage.includes('tell me about myself') ||
      lowerMessage.includes('what am i like') ||
      lowerMessage.includes('my profile') ||
      lowerMessage.includes('about me') ||
      lowerMessage.includes('personality');

    let assistantResponse = '';
    let profileGenerated = false;

    if (isAskingAboutSelf) {
      // Check if we have a personality profile
      const existingProfile = await getLatestPersonalityProfile(userId);

      if (existingProfile && existingProfile.confidence_score > 0.3) {
        // Use existing profile to respond
        assistantResponse = await generateProfileResponse(userMessage, existingProfile);
      } else if (chatHistory.length >= 10) {
        // Generate new profile and respond
        const profile = await generatePersonalityProfile(chatHistory);
        await savePersonalityProfile({
          user_id: userId,
          conversation_id: conversationId,
          ...profile,
        });
        profileGenerated = true;

        assistantResponse = await generateProfileResponse(userMessage, {
          ...profile,
          confidence_score: profile.confidence_score,
        });
      } else {
        // Not enough messages to generate profile
        assistantResponse =
          "I'd love to tell you about yourself! Let's chat a bit more first, and after a few more messages, I'll have enough insight to share your personality profile.";
      }
    } else {
      // Regular conversation - stream the response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = '';
            const streamGenerator = generateChatResponseStream(chatHistory);

            for await (const chunk of streamGenerator) {
              fullResponse += chunk;
              controller.enqueue(`data: ${JSON.stringify({ chunk })}\n\n`);
            }

            // Save the full response
            await saveMessage(conversationId, userId, 'assistant', fullResponse);

            // Check if we should auto-generate profile
            if (shouldGenerateProfile(chatHistory.length)) {
              try {
                const profile = await generatePersonalityProfile([...chatHistory, { role: 'assistant', content: fullResponse }]);
                await savePersonalityProfile({
                  user_id: userId,
                  conversation_id: conversationId,
                  ...profile,
                });
                profileGenerated = true;
              } catch (error) {
                console.error('Error generating personality profile:', error);
              }
            }

            // Auto-generate title for first message
            if (messages.length === 1) {
              try {
                const titleResponse = await generateChatResponse(
                  [{ role: 'user', content: `Create a brief 3-5 word title for this conversation: "${userMessage}"` }],
                  'Generate a short, relevant title.'
                );
                await updateConversationTitle(conversationId, titleResponse.content.slice(0, 100));
              } catch (error) {
                console.error('Error generating title:', error);
              }
            }

            controller.enqueue(`data: ${JSON.stringify({ done: true, profileGenerated })}\n\n`);
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For non-streaming responses (profile responses)
    await saveMessage(conversationId, userId, 'assistant', assistantResponse);

    // Auto-generate title for first message
    if (messages.length === 1) {
      try {
        const titleResponse = await generateChatResponse(
          [{ role: 'user', content: `Create a brief 3-5 word title for this conversation: "${userMessage}"` }],
          'Generate a short, relevant title.'
        );
        await updateConversationTitle(conversationId, titleResponse.content.slice(0, 100));
      } catch (error) {
        console.error('Error generating title:', error);
      }
    }

    return NextResponse.json({
      assistantResponse,
      profileGenerated,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
