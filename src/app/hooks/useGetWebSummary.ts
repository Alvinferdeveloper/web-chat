import { useState } from "react";

export default function useGetWebSummary(){
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing ] = useState(false);
    const [ answer, setAnswer ] = useState('')
    async function getWebSummary(provider: string, apiKey: string, url: string){
        setIsProcessing(true);
        const res = await fetch(`http://localhost:3000/api/getWebSummary`, {
            method: 'POST',
            body: JSON.stringify({ provider, apiKey, url }),
        });
        const json = await res.json();
        setIsProcessing(false);
        if(!res.ok){
            return setError(json.error);
        }
        setError('')
        setAnswer(json.answer);
    }

    return { getWebSummary, error, isProcessing, answer};
}