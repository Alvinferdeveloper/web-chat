"use client"

import { useState } from 'react';
import { Conversation } from '@/app/types/types';
import ConversationHistory from './conversationHistory';
import LlmProcessing from './llmProcessing';

export default function ChatWrapper() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleNewConversation = () => {
        setSelectedConversation(null);
    };

    return (
        <div className="h-full flex">
            <ConversationHistory
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
            />
            <LlmProcessing key={selectedConversation?.id || 'new'} initialConversation={selectedConversation} />
        </div>
    );
}
