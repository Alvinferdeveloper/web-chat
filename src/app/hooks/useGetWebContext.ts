import { useState } from "react";

export default function useGetWebContext() {
    const [urls, setUrls] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState('');
    const [context, setContext] = useState('');

    async function getWebSummary(newUrl: string) {
        setIsProcessing(true);
        setSummary('');
        setContext('');
        setError('');
        setUrls([newUrl]);

        const res = await fetch(`/api/getWebContext`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urls: [newUrl] }),
        });
        const json = await res.json();
        setIsProcessing(false);

        if (!res.ok) {
            return setError(json.error);
        }

        setError('');
        setContext(json.context);
        setSummary(json.summary || '');
    }

    async function addUrl(newUrl: string) {
        if (urls.includes(newUrl)) return;
        const newUrls = [...urls, newUrl];
        setUrls(newUrls);
    }

    async function removeUrl(urlToRemove: string) {
        const newUrls = urls.filter(url => url !== urlToRemove);
        setUrls(newUrls);

        if (newUrls.length === 0) {
            clearContext();
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch(`/api/getWebContext`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls: newUrls }),
            });
            const json = await res.json();

            if (!res.ok) {
                setError(json.error);
                setUrls(urls); // Revert urls state if error
            } else {
                setContext(json.context);
            }
        } catch (e) {
            const error = e as Error
            setError(error.message);
            setUrls(urls); // Revert urls state if error
        } finally {
            setIsProcessing(false);
        }
    }

    function setWebContext(newUrls: string[], summary: string, context: string) {
        setUrls(newUrls);
        setSummary(summary);
        setContext(context);
        setError('');
        setIsProcessing(false);
    }

    function updateConversationContext(context: string) {
        setContext(context)
    }

    function clearContext() {
        setUrls([]);
        setSummary('');
        setContext('');
        setError('');
    }

    return { urls, getWebSummary, addUrl, removeUrl, error, isProcessing, summary, context, setWebContext, clearContext, updateConversationContext };
}
