"use client"
import { Message, useChat } from 'ai/react'
import { useSession } from 'next-auth/react';

import { useGlobalContext } from '@/app/providers/globalContextProvider';
import { useChatScroll } from '@/app/hooks/useChatScroll';
import { useConversationSaver } from '@/app/hooks/useConversationSaver';

import MessageCard from './messageCard';
import ChatInput from './chatInput';

interface Props {
    url: string;
    summary: string;
    context: string;
    initialMessages?: Message[];
}

export default function ChatArea({ url, summary, context, initialMessages }: Props) {
    const { data: session } = useSession();
    const { activeSubscription } = useGlobalContext();

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages,
        body: {
            context,
            subscriptionId: activeSubscription.id,
            planId: activeSubscription.planId,
        },
    });

    const messagesEndRef = useChatScroll(messages);
    const { isSaving, isSaved, saveConversation } = useConversationSaver();

    const handleSave = () => {
        saveConversation({ url, summary, context, messages });
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((m) => (
                    <MessageCard key={m.id} role={m.role} content={m.content} userImage={session?.user.image || undefined} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleSave={handleSave}
                isSaving={isSaving}
                isSaved={isSaved}
                canSave={messages.length > 0}
            />
        </div>
    )
}