import { useEffect, useState } from 'react';

function detectWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

/**
 * Detects real WebGL availability (not just browser support — covers
 * disabled GPU/driver blocklist cases too, since getContext returns null
 * there). Used to decide whether to mount a Three.js scene at all.
 */
export default function useWebGLSupport() {
  const [supported, setSupported] = useState(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}
