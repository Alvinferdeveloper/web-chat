import { useState } from "react";

export default function useGetWebContext() {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState('');
    const [context, setContext] = useState('');

    async function getWebSummary(newUrl: string) {
        setIsProcessing(true);
        setSummary('');
        setContext('');
        setError('');
        setUrl(newUrl);

        const res = await fetch(`/api/getWebContext`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: newUrl }),
        });
        const json = await res.json();
        console.log(json)
        setIsProcessing(false);

        if (!res.ok) {
            return setError(json.error);
        }

        setError('');
        setSummary(json.summary);
        setContext(json.context);
    }

    function setWebContext(url: string, summary: string, context: string) {
        setUrl(url);
        setSummary(summary);
        setContext(context);
        setError('');
        setIsProcessing(false);
    }

    function clearContext() {
        setUrl('');
        setSummary('');
        setContext('');
        setError('');
    }

    return { url, getWebSummary, error, isProcessing, summary, context, setWebContext, clearContext };
}