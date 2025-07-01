"use client"
import { useEffect } from 'react';
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea"
import useGetWebContext from "../../hooks/useGetWebContext"
import { Conversation } from '@/app/types/types';

interface Props {
    initialConversation: Conversation | null;
}

export default function LlmProcessing({ initialConversation }: Props) {
    const { url, getWebSummary, error, isProcessing, summary, context, setWebContext, clearContext } = useGetWebContext();

    useEffect(() => {
        if (initialConversation) {
            setWebContext(initialConversation.url, initialConversation.summary, initialConversation.context);
        } else {
            clearContext();
        }
    }, [initialConversation]);

    return (
        <div className="relative h-full flex flex-col w-4/5">
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
            />
        </div>
    )
}