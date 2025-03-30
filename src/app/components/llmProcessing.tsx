"use client"
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea"
import useGetWebSummary from "../hooks/useGetWebSummary"

export default function LlmProcessing() {
    const { getWebSummary, error, isProcessing, summary, context } = useGetWebSummary();
    return (
        <div className="relative">
            <UrlProcessor
                getWebSummary={getWebSummary}
                error={error}
                isProcessing={isProcessing}
                summary={summary}
            />
            <ChatArea context={context} />
        </div>
    )
}