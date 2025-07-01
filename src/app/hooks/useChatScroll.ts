import { useEffect, useRef } from 'react';

/**
 * Custom hook to scroll a chat-like container to the bottom.
 * @param dep The dependency that triggers the scroll effect (e.g., messages array).
 * @returns A ref to be attached to the element that should be scrolled into view.
 */
export function useChatScroll<T>(dep: T) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [dep]);
    return ref;
}
