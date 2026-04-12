import { useEffect, useState } from 'react';

/**
 * Возвращает значение с задержкой: обновляется после `delayMs` мс
 * стабильности входного `value` (последний ввод в «окне»).
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
