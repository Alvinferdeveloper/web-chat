
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Link } from 'lucide-react';

interface Props {
    urls: string[];
    onRemoveUrl: (url: string) => void;
}

export default function UrlListModal({ urls, onRemoveUrl }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Link className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Context URLs</DialogTitle>
                </DialogHeader>
                <ul className="space-y-2">
                    {urls.map((url) => (
                        <li key={url} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                            <span className="text-white truncate">{url}</span>
                            <Button variant="ghost" size="icon" onClick={() => onRemoveUrl(url)}>
                                <X className="h-4 w-4 text-gray-400" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
