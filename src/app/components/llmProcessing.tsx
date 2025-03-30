"use client"
import UrlProcessor from "./urlProcessor";
import ChatArea from "./chatArea"
import useGetWebContext from "../hooks/useGetWebContext"

export default function LlmProcessing() {
    const { getWebSummary, error, isProcessing, summary, context } = useGetWebContext();
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