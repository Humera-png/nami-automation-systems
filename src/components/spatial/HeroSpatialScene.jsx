import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Environment, Lightformer } from '@react-three/drei';
import NamiProcessStructure from './NamiProcessStructure';
import useReducedMotion from '../../hooks/useReducedMotion';
import useMinWidth from '../../hooks/useMinWidth';
import './HeroSpatialScene.css';

/**
 * The hero's spatial environment. Kept isolated behind React.lazy at the
 * call site so the Three.js/R3F/drei chunk never blocks first paint —
 * this component assumes WebGL support and reduced-motion have already
 * been checked by the caller.
 */
export default function HeroSpatialScene() {
  const reducedMotion = useReducedMotion();
  const isLargeDesktop = useMinWidth(1280);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / 700, 1);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !isLargeDesktop) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;
    const handleMove = (event) => {
      const rect = node.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1
      };
    };
    const handleLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
    };
    node.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseleave', handleLeave);
    return () => {
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, isLargeDesktop]);

  return (
    <div className="hero-spatial" ref={containerRef}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 34 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <AdaptiveDpr pixelated={false} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 6, 4]} intensity={1.6} />
        <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#d2d0c9" />
        <Suspense fallback={null}>
          {/* Procedural lighting only — no external HDR fetch, keeps the
              hero fully self-contained with no third-party dependency. */}
          <Environment resolution={256}>
            <Lightformer intensity={3} color="#f4f2ec" position={[0, 4, -4]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.4} color="#d2d0c9" position={[-4, 2, 2]} scale={[6, 6, 1]} rotation={[0, Math.PI / 2, 0]} />
            <Lightformer intensity={1.8} color="#eceae4" position={[4, -1, 3]} scale={[6, 6, 1]} rotation={[0, -Math.PI / 2, 0]} />
          </Environment>
          <NamiProcessStructure active={!reducedMotion} scrollRef={scrollRef} pointerRef={pointerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
