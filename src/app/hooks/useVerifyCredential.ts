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
        setIsProcessing(false);
        if(!res.ok){
            return setError(json.error);
        }
        setError('')
        setAnswer(json.answer);
    }

    return { verifyCredentials, error, isProcessing, answer};
}