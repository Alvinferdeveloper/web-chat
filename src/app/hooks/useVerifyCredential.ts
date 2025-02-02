import { useState } from "react";

export default function useVerifyCredential(){
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    async function verifyCredentials(provider: string, apiKey: string){
        setIsProcessing(true);
        const res = await fetch(`http://localhost:3000/api/verifyProviderCredentials`, {
            method: 'POST',
            body: JSON.stringify({ provider, apiKey }),
        });
        const json = await res.json();
        if(!res.ok){
            setError(json.error);
        }
        setIsProcessing(false);
    }

    return { verifyCredentials, error, isProcessing };
}