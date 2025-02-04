"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from 'ai/react'
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    context: string,
    provider: string,
    apiKey: string,
    
}

export default function ChatArea({ context, provider, apiKey}:Props) {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: {
            context,
            provider,
            apiKey,
        },
    });
    return (

        <div>
            <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    {messages.map((m) => (
                        <Card key={m.id} className="mb-4 max-w-[80%] mx-auto">
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <Avatar>
                                        <AvatarFallback>{m.role === "user" ? <User /> : <Bot />}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">{m.role === "user" ? "Tú" : "AI"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{m.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>

                {/* Input area */}
                <form className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700" onSubmit={handleSubmit}>
                    <div className="flex space-x-2">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Escribe tu mensaje aquí..."
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}