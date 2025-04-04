import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface MessageCardProps {
    role: string;
    content: string;
    userImage?: string;
}

export default function MessageCard({ role, content, userImage }: MessageCardProps) {
    const isUser = role === 'user';
    return (
        <Card className="mb-4 max-w-[80%] mx-auto bg-gray-700 border-gray-600">
            <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                    <Avatar>
                        {isUser && userImage ? (
                            <AvatarImage src={userImage} />
                        ) : (
                            <Bot className="text-gray-200" />
                        )}
                    </Avatar>
                    <div className="space-y-2">
                        <p className={cn(
                            "text-sm font-medium",
                            "text-gray-200"
                        )}>
                            {isUser ? "Tú" : "AI"}
                        </p>
                        <ReactMarkdown
                            className={cn(
                                "prose",
                                "text-md text-gray-300",
                                "tracking-wide leading-loose"
                            )}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}