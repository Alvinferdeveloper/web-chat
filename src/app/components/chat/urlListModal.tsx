
'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X, Link } from 'lucide-react';

interface Props {
    urls: string[];
    onRemoveUrl: (url: string) => void;
}

export default function UrlListModal({ urls, onRemoveUrl }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                    <Link className="h-6 w-6 text-white" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-dark text-white">
                <div className="grid gap-4">
                    <h4 className="font-medium leading-none">Context URLs</h4>
                    <div className="grid gap-2">
                        {urls.map((url, i) => (
                            <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-2">
                                <div className="truncate text-sm font-mono bg-gray-700 p-2 rounded">{url}</div>
                                <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => onRemoveUrl(url)}>
                                    <X className="h-4 w-4 text-gray-400" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
