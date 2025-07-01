"use client"

import { useState, useEffect } from "react";
import LlmProcessing from "./llmProcessing";
import ConversationHistory from "./conversationHistory";
import { Conversation } from "@/app/types/types";

export default function ChatWrapper() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleNewConversation = () => {
        setSelectedConversation(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleNewConversationAdded = (newConversation: Conversation) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
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
                    onConversationSaved={handleNewConversationAdded}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
            </div>
        </div>
    );
}
