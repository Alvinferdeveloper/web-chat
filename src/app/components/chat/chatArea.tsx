'use client'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react';
import { useGlobalContext } from '@/app/providers/globalContextProvider';
import { useChatScroll } from '@/app/hooks/ui/useChatScroll';
import MessageCard from './messageCard';
import ChatInput from './chatInput';
import { Message } from 'ai/react';

interface Props {
    context: string;
    initialMessages?: Message[]
    conversationId: string;
    syncHistoryMessages: (messages: Message[]) => void;
    updateMessages: (newMessages: Message[]) => Promise<void>;
}

export default function ChatArea({ context, initialMessages, conversationId, syncHistoryMessages, updateMessages }: Props) {
    const { data: session } = useSession();
    const { activeSubscription } = useGlobalContext();

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages,
        body: {
            context,
            subscriptionId: activeSubscription.id,
            planId: activeSubscription.planId,
            conversationId: conversationId,
        },
        onFinish: async (message) => {
            const newMessages: Message[] = [
                { role: "user", content: input, id: 'temp-user-id' },
                message
            ];
            syncHistoryMessages(newMessages);
            await updateMessages(newMessages);
        }
    });

    const messagesEndRef = useChatScroll(messages);

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
            />
        </div>
    )
}