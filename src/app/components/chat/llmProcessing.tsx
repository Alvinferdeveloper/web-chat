"use client"
import { useEffect } from 'react';
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea"
import useGetWebContext from "../../hooks/useGetWebContext"
import { Conversation } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';

interface Props {
    initialConversation: Conversation | null;
    onConversationSaved: (conversation: Conversation) => void;
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export default function LlmProcessing({ initialConversation, onConversationSaved, toggleSidebar, isSidebarOpen }: Props) {
    const { url, getWebSummary, error, isProcessing, summary, context, setWebContext, clearContext } = useGetWebContext();

    useEffect(() => {
        if (initialConversation) {
            setWebContext(initialConversation.url, initialConversation.summary, initialConversation.context);
        } else {
            clearContext();
        }
    }, [initialConversation]);

    return (
        <div className="relative h-full flex flex-col">
            {!isSidebarOpen && (
                <Button
                    onClick={toggleSidebar}
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-50 text-white bg-gray-800 hover:bg-gray-700"
                >
                    <PanelLeftOpen className="h-6 w-6" />
                </Button>
            )}
            <UrlProcessor
                url={url}
                getWebSummary={getWebSummary}
                error={error}
                isProcessing={isProcessing}
                summary={summary}
            />
            <ChatArea
                url={url}
                summary={summary}
                context={context}
                initialMessages={initialConversation?.messages}
                onConversationSaved={onConversationSaved}
            />
        </div>
    )
}