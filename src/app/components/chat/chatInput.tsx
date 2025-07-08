"use client"
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
}: ChatInputProps) {
    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex space-x-2 w-full max-w-4xl mx-auto">
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
    )
}
