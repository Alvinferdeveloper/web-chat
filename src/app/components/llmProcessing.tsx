"use client"
import CredentialsForm from "./credentialsForm"
import ChatArea from "./chatArea"
import useGetWebSummary from "../hooks/useGetWebSummary"
import { useState } from "react"


type provider = {
    id: string,
    name: string,
    iconSrc: string
}

interface Props {
    providers: provider[]
}
export default function LlmProcessing({ providers }: Props) {
    const { getWebSummary, error, isProcessing, answer } = useGetWebSummary();
    const [provider, setProvider] = useState(providers[0].id);
    const [apiKey, setApiKey] = useState('');
    const [url, setUrl] = useState('');
    return (
        <div className=" relative">
            <CredentialsForm
                providers={providers}
                getWebSummary={getWebSummary}
                error={error}
                isProcessing={isProcessing}
                answer={answer}
                provider={provider}
                setProvider={setProvider}
                apiKey={apiKey}
                setApiKey={setApiKey}
                url={url}
                setUrl={setUrl}
            />
            <ChatArea context={answer} provider={provider} apiKey={apiKey} />
        </div>
    )
}