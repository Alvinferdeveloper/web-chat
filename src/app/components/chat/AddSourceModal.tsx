
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddSourceModalProps {
  onAddSource: (url: string) => void;
}

export default function AddSourceModal({ onAddSource }: AddSourceModalProps) {
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    if (url) {
      onAddSource(url);
      setUrl('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark text-white">
        <DialogHeader>
          <DialogTitle>Agregar fuente</DialogTitle>
          <DialogDescription>
            Introduce la URL de la web que deseas usar como fuente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Agregar fuente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
