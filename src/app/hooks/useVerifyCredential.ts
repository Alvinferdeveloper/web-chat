import { useState } from "react";

export default function useVerifyCredential(){
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing ] = useState(false);
    const [ answer, setAnswer ] = useState('')
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
        setError('')
        setIsProcessing(false);
        setAnswer(json.answer);
    }

    return { verifyCredentials, error, isProcessing, answer};
}