'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

interface Props {
    onAddSource: (url: string) => Promise<void>;
}

export default function AddSourceForm({ onAddSource }: Props) {
    const [sourceUrl, setSourceUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('submit')
        if (!sourceUrl) return;
        console.log(sourceUrl)
        setIsSubmitting(true);
        await onAddSource(sourceUrl);
        setIsSubmitting(false);
        setSourceUrl('');
    };

    return (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-gray-400" />
                <Input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Add another URL to expand the context..."
                    className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting || !sourceUrl}>
                    {isSubmitting ? 'Adding...' : 'Add Source'}
                </Button>
            </form>
        </div>
    );
}