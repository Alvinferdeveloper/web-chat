"use client"

import { useState } from "react";
import LlmProcessing from "./llmProcessing";
import ConversationHistory from "./conversationHistory";
import { Conversation } from "@/app/types/types";
import { useConversations } from "@/app/hooks/useConversations";

export default function ChatWrapper() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { conversations, isLoading, error, syncHistoryMessages, setConversations } = useConversations();

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleNewConversation = () => {
        setSelectedConversation(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="h-full flex bg-gray-900">
            <ConversationHistory
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                conversations={conversations}
                isLoading={isLoading}
                error={error}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
            />
            <div className={`relative h-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-4/5' : 'w-full'}`}>
                <LlmProcessing
                    key={selectedConversation?.id || 'new'}
                    initialConversation={selectedConversation}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    syncHistoryMessages={(messages) => selectedConversation && syncHistoryMessages(selectedConversation.id, messages)}
                    setConversations={setConversations}
                />
            </div>
        </div>
    );
}
