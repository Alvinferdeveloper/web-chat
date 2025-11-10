import { useEffect, useRef } from 'react';

export function useChatScroll<T>(dep: T) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [dep]);
    return ref;
}
