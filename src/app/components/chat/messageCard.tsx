import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface MessageCardProps {
    role: string;
    content: string;
    userImage?: string;
}

export default function MessageCard({ role, content, userImage }: MessageCardProps) {
    return (
        <Card className="mb-4 max-w-[80%] mx-auto bg-gray-700 border-gray-600">
            <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                    <Avatar>
                        {
                            role === 'user' && userImage ? <AvatarImage src={userImage} /> : <Bot className="text-gray-200" />
                        }
                    </Avatar>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-200">{role === "user" ? "Tú" : "AI"}</p>
                        <ReactMarkdown className="prose text-md text-gray-300 tracking-wide leading-loose">{content}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}