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

export default function ChatArea({ context, provider, apiKey }: Props) {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        body: {
            context,
            provider,
            apiKey,
        },
    });
    return (
            <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    {messages.map((m) => (
                        <Card key={m.id} className="mb-4 max-w-[80%] mx-auto bg-gray-700 border-gray-600">
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <Avatar>
                                        <AvatarFallback>
                                            {m.role === "user" ? <User className="text-gray-200" /> : <Bot className="text-gray-200" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-200">{m.role === "user" ? "Tú" : "AI"}</p>
                                        <p className="text-sm text-gray-300">{m.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ScrollArea>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="fixed bottom-4 flex justify-center w-full left-0">
                    <div className="flex space-x-2 w-full max-w-4xl">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Escribe tu mensaje aquí..."
                            className="flex-1 h-12 bg-gray-700 border-gray-600 text-white placeholder-neutral-50"
                        />
                        <Button type="submit" className="bg-blue-600 h-12 w-14 hover:bg-blue-700">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
    )
}