import { useState } from "react";

export default function useGetWebContext(){
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing ] = useState(false);
    const [ summary, setSummary ] = useState('');
    const [ context, setContext ] = useState('')
    async function getWebSummary(url: string){
        setIsProcessing(true);
        const res = await fetch(`http://localhost:3000/api/getWebContext`, {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
        const json = await res.json();
        setIsProcessing(false);
        if(!res.ok){
            return setError(json.error);
        }
        setError('')
        setSummary(json.summary);
        setContext(json.context);
    }

    return { getWebSummary, error, isProcessing, summary, context};
}