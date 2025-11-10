"use client"

import { useState, useMemo } from "react";
import LlmProcessing from "./llmProcessing";
import ConversationHistory from "./conversationHistory";
import { useConversationsManager } from "@/app/hooks/state/useConversationsManager";

export default function ChatWrapper() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const {
        conversations,
        isLoading,
        error,
        deleteConversation,
        activeConversationId,
        setActiveConversationId,
        syncHistoryMessages,
        createConversation,
        addSource,
        updateMessages,
        removeSource
    } = useConversationsManager();

    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId) || null;
    }, [conversations, activeConversationId]);

    const handleNewConversation = () => {
        setActiveConversationId(null);
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
                onSelectConversation={(conv) => setActiveConversationId(conv.id)}
                onNewConversation={handleNewConversation}
                onDeleteConversation={deleteConversation}
                activeConversationId={activeConversationId}
            />
            <div className={`relative h-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-4/5' : 'w-full'}`}>
                <LlmProcessing
                    key={activeConversationId || 'new'}
                    initialConversation={activeConversation}
                    syncHistoryMessages={syncHistoryMessages}
                    onCreateConversation={createConversation}
                    onAddSource={addSource}
                    updateMessages={updateMessages}
                    onRemoveSource={removeSource}
                />
            </div>
        </div>
    );
}
