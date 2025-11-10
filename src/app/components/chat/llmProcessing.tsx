'use client'
import { useEffect } from 'react';
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea";
import { Conversation } from '@/app/types/types';
import { Message } from "ai/react"
import UrlListModal from './urlListModal';
import AddSourceModal from './AddSourceModal';
import { useWebContextManager } from '@/app/hooks/state/useWebContextManager';

interface Props {
    initialConversation: Conversation | null;
    syncHistoryMessages: (conversationId: string, messages: Message[]) => void;
    onCreateConversation: (context: string, urls: string[], summary: string) => Promise<Conversation | undefined>;
    onAddSource: (conversationId: string, url: string) => Promise<string | undefined>;
    updateMessages: (conversationId: string, newMessages: Message[]) => Promise<void>;
    onRemoveSource: (conversationId: string, urlToRemove: string) => Promise<Conversation | undefined>;
}

export default function LlmProcessing({ 
    initialConversation, 
    syncHistoryMessages,
    onCreateConversation,
    onAddSource,
    updateMessages,
    onRemoveSource
}: Props) {
    const {
        urls,
        summary,
        context,
        isProcessing,
        error,
        processNewWebContext,
        addUrlToContext,
        loadContextFromConversation,
        updateContext
    } = useWebContextManager();

    useEffect(() => {
        loadContextFromConversation(initialConversation);
    }, [initialConversation, loadContextFromConversation]);

    const handleProcessUrl = async (url: string) => {
        if (initialConversation) return; // Only for new conversations
        try {
            const { newContext, newSummary, newUrls } = await processNewWebContext(url);
            await onCreateConversation(newContext, newUrls, newSummary);
        } catch (err) {
            console.error("Failed to process URL and create conversation", err);
        }
    };

    const handleAddSource = async (sourceUrl: string) => {
        if (!initialConversation) return;
        try {
            const newContext = await onAddSource(initialConversation.id, sourceUrl);
            if (newContext) {
                updateContext(newContext);
                addUrlToContext(sourceUrl);
            }
        } catch (err) {
            console.error("Failed to add source", err);
        }
    };

    const handleRemoveSource = async (urlToRemove: string) => {
        if (!initialConversation) return;
        try {
            const updatedConversation = await onRemoveSource(initialConversation.id, urlToRemove);
            if (updatedConversation) {
                loadContextFromConversation(updatedConversation);
            }
        } catch (err) {
            console.error("Failed to remove source", err);
        }
    };

    const conversationId = initialConversation?.id;

    return (
        <div className="relative h-full flex flex-col">
            <UrlProcessor
                url={urls.length > 0 ? urls[0] : ''}
                getWebSummary={handleProcessUrl}
                error={error}
                isProcessing={isProcessing}
                summary={summary}
                urlListButton={urls.length > 0 && <UrlListModal urls={urls} onRemoveUrl={handleRemoveSource} />}
                addSourceButton={!!conversationId && <AddSourceModal onAddSource={handleAddSource} />}
            />

            {context && conversationId && (
                <>
                    <ChatArea
                        context={context}
                        initialMessages={initialConversation?.messages}
                        conversationId={conversationId}
                        syncHistoryMessages={(messages) => syncHistoryMessages(conversationId, messages)}
                        updateMessages={(newMessages) => updateMessages(conversationId, newMessages)}
                    />
                </>
            )}
        </div>
    )
}
