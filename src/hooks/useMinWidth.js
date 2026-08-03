import { useEffect, useState } from 'react';

export default function useMinWidth(px) {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
