import { useCallback, useEffect, useState } from 'react';

export function useOnScreen(): readonly [
  (element: HTMLElement | null) => void,
  boolean,
] {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  const setRef = useCallback((element: HTMLElement | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node) {
      setIsOnScreen(false);
      return () => {};
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setRef, isOnScreen] as const;
}
