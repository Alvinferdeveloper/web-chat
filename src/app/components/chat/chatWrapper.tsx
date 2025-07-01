"use client"

import { useState, useEffect } from "react";
import LlmProcessing from "./llmProcessing";
import ConversationHistory from "./conversationHistory";
import { Conversation } from "@/app/types/types";

export default function ChatWrapper() {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
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

    const handleNewConversationAdded = (newConversation: Conversation) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
    };

    return (
        <div className="h-full flex">
            <ConversationHistory
                conversations={conversations}
                isLoading={isLoading}
                error={error}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
            />
            <LlmProcessing
                key={selectedConversation?.id || 'new'}
                initialConversation={selectedConversation}
                onConversationSaved={handleNewConversationAdded}
            />
        </div>
    );
}
