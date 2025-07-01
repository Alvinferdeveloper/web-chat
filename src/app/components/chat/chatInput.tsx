"use client"
import { Send, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSave: () => void;
    isSaving: boolean;
    isSaved: boolean;
    canSave: boolean;
}

export default function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    handleSave,
    isSaving,
    isSaved,
    canSave
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
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isSaved || !canSave}
                    className="bg-green-600 h-12 w-36 hover:bg-green-700 disabled:bg-gray-500 flex items-center justify-center"
                >
                    {isSaving ? 'Guardando...' : isSaved ? '¡Guardado!' : 'Guardar Chat'}
                    {!isSaving && !isSaved && <Save className="h-4 w-4 ml-2" />}
                </Button>
            </div>
        </form>
    )
}
