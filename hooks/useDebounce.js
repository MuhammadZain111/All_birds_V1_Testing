import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  // Initialize with undefined/null, not `value` — avoids stale initial state
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
    // Must compare value by reference — arrays/objects from context
    // re-render each time, so debounce resets correctly
  }, [value,delay]);

  return debounced;
}
