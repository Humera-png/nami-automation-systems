import { useEffect, useState } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Drives a step-by-step workflow animation: index -1 (idle) -> 0..n-1,
 * holding each step for durations[i] ms, then optionally looping after a
 * short reset gap. Pass a `restartKey` that changes whenever the caller's
 * step definitions change (durations itself is intentionally not a dep —
 * callers usually pass a fresh array literal each render).
 */
export default function useTimedSequence(durations, { loop = true, enabled = true, restartKey } = {}) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(reducedMotion ? durations.length - 1 : -1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setIndex(durations.length - 1);
      return undefined;
    }
    if (!enabled) {
      setIndex(-1);
      return undefined;
    }

    let cancelled = false;
    let timeoutId;

    const runStep = (i) => {
      if (cancelled) return;
      setIndex(i);
      const hold = durations[i] ?? 1200;
      if (i < durations.length - 1) {
        timeoutId = setTimeout(() => runStep(i + 1), hold);
      } else if (loop) {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setIndex(-1);
          setCycle((current) => current + 1);
          timeoutId = setTimeout(() => runStep(0), 500);
        }, hold);
      }
    };

    timeoutId = setTimeout(() => runStep(0), 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, enabled, restartKey, loop, durations.length]);

  return { index, cycle, reducedMotion };
}
