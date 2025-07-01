"use client"

import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Loader2, AlertTriangle, ChevronLeft } from "lucide-react";
import { Conversation } from "@/app/types/types";

interface Props {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    conversations: Conversation[];
    isLoading: boolean;
    error: string | null;
    onSelectConversation: (conversation: Conversation) => void;
    onNewConversation: () => void;
}

export default function ConversationHistory({
    isSidebarOpen,
    toggleSidebar,
    conversations,
    isLoading,
    error,
    onSelectConversation,
    onNewConversation
}: Props) {
    return (
        <div className={`bg-gray-800 h-screen flex flex-col transition-all duration-300 ease-in-out  ${isSidebarOpen ? 'w-1/5 p-4 pt-14' : 'w-0'}`}>
            <div className={`flex-grow flex flex-col overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white whitespace-nowrap">Historial</h2>
                    <Button onClick={toggleSidebar} variant="ghost" size="icon" className="text-white hover:bg-gray-700 z-[100]">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                </div>
                <Button onClick={onNewConversation} className="mb-4 bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Chat
                </Button>
                <div className="flex-grow overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center text-red-400">
                            <AlertTriangle className="h-6 w-6 mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <ul>
                            {conversations.map((conv) => (
                                <li key={conv.id}
                                    onClick={() => onSelectConversation(conv)}
                                    className="flex items-center p-2 text-white rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                                >
                                    <MessageSquare className="mr-3 h-5 w-5" />
                                    <span className="truncate">{conv.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
