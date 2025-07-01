"use client"

import { useEffect, useState } from 'react';
import { Conversation } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare } from 'lucide-react';

interface Props {
    onSelectConversation: (conversation: Conversation) => void;
    onNewConversation: () => void;
}

export default function ConversationHistory({ onSelectConversation, onNewConversation }: Props) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    return (
        <div className="bg-gray-800 p-4 pt-14 flex flex-col h-screen w-1/5">
            <h2 className="text-xl font-bold text-white mb-4">Historial</h2>
            <Button onClick={onNewConversation} className="mb-4 bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Chat
            </Button>
            <div className="flex-grow overflow-y-auto">
                {isLoading && <p className="text-gray-400">Cargando historial...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {!isLoading && !error && (
                    <ul>
                        {conversations.map((convo) => (
                            <li key={convo.id} 
                                onClick={() => onSelectConversation(convo)} 
                                className="flex items-center p-2 text-white rounded-md hover:bg-gray-700 cursor-pointer mb-2">
                                <MessageSquare className="mr-3 h-5 w-5" />
                                <span className="flex-grow truncate">{convo.title}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
