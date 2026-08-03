import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// NOT a tube/pipe. Discrete independent fragments — glass plates, data
// slabs, graphite rails, small markers — scattered at load, then
// assembling once into one composed structure over ~1.5s. After that,
// only a slow whole-group idle rotation + pointer parallax continue.
const FRAGMENTS = [
  { kind: 'glass', start: [-5.6, 2.9, -4.5], end: [-1.6, 1.2, -0.2], size: [1.4, 0.9, 0.05] },
  { kind: 'glass', start: [5.2, -2.6, -6], end: [1.8, -0.7, 0.6], size: [1.1, 1.5, 0.05] },
  { kind: 'mineral', start: [5.8, 3.1, -3.5], end: [2.6, 1.4, 1.1], size: [0.8, 1.0, 0.08] },
  { kind: 'mineral', start: [-3.2, -3.6, -5], end: [-2.4, -1.3, 0.4], size: [1.0, 0.7, 0.08] },
  { kind: 'rail', start: [3.4, -3.8, -3], end: [0.6, -1.6, 1.3], size: [1.6, 0.16, 0.16] },
  { kind: 'rail', start: [-4.4, 0.6, -6.5], end: [-0.4, 0.9, -0.6], size: [1.9, 0.14, 0.14] },
  { kind: 'marker', start: [4.4, 1.1, -2], end: [1.4, 0.3, 1.9], size: [0.12, 0.12, 0.12] },
  { kind: 'marker', start: [-2.6, -0.6, -3.6], end: [-1.0, -1.1, 1.5], size: [0.1, 0.1, 0.1] },
  { kind: 'marker', start: [1.4, 3.4, -5], end: [0.4, 1.6, 0.9], size: [0.11, 0.11, 0.11] }
];

const CONNECTOR_PAIRS = [
  [1, 4],
  [4, 6],
  [2, 7]
];

const MATERIAL_COLORS = {
  glass: '#e7e5de',
  mineral: '#d8d5cc',
  rail: '#2b312f'
};

const ASSEMBLY_DURATION = 1.6;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function lerpVec(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function FragmentMesh({ fragment, progress }) {
  const meshRef = useRef(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(...fragment.size), [fragment.size]);

  useFrame(() => {
    if (!meshRef.current) return;
    const eased = easeOutCubic(progress.current);
    const [x, y, z] = lerpVec(fragment.start, fragment.end, eased);
    meshRef.current.position.set(x, y, z);
  });

  if (fragment.kind === 'glass') {
    return (
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.3}
          transmission={0.85}
          ior={1.3}
          chromaticAberration={0.008}
          samples={3}
          resolution={192}
          color={MATERIAL_COLORS.glass}
          backside
        />
      </mesh>
    );
  }

  if (fragment.kind === 'marker') {
    return (
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color="#625CFF" emissive="#625CFF" emissiveIntensity={0.7} roughness={0.3} metalness={0.2} />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color={MATERIAL_COLORS[fragment.kind]}
        roughness={fragment.kind === 'rail' ? 0.4 : 0.55}
        metalness={fragment.kind === 'rail' ? 0.35 : 0.05}
        transmission={fragment.kind === 'mineral' ? 0.15 : 0}
        transparent={fragment.kind === 'mineral'}
        opacity={fragment.kind === 'mineral' ? 0.92 : 1}
        clearcoat={0.15}
      />
    </mesh>
  );
}

function Connector({ from, to, progress }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const eased = easeOutCubic(progress.current);
    const fromPos = lerpVec(from.start, from.end, eased);
    const toPos = lerpVec(to.start, to.end, eased);
    const mid = lerpVec(fromPos, toPos, 0.5);
    const dx = toPos[0] - fromPos[0];
    const dy = toPos[1] - fromPos[1];
    const dz = toPos[2] - fromPos[2];
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    meshRef.current.position.set(mid[0], mid[1], mid[2]);
    meshRef.current.lookAt(toPos[0], toPos[1], toPos[2]);
    meshRef.current.rotateX(Math.PI / 2);
    meshRef.current.scale.set(1, length, 1);

    // Only visible once the structure has mostly assembled, then pulses
    // very slowly — a signal path connecting, not a constant glow.
    const reveal = THREE.MathUtils.smoothstep(progress.current, 0.75, 1);
    const pulse = 0.4 + 0.3 * Math.sin(state.clock.elapsedTime * 0.6);
    meshRef.current.material.opacity = reveal * pulse;
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
      <meshBasicMaterial color="#625CFF" transparent opacity={0} />
    </mesh>
  );
}

export default function NamiProcessStructure({ active = true, scrollRef, pointerRef }) {
  const groupRef = useRef(null);
  const progress = useRef(0);
  const idleRotation = useRef(0);
  const startTime = useRef(null);

  useFrame((state, delta) => {
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    progress.current = Math.min(elapsed / ASSEMBLY_DURATION, 1);

    if (!groupRef.current) return;
    const scrollOffset = scrollRef?.current ?? 0;
    const pointer = pointerRef?.current ?? { x: 0, y: 0 };

    if (active && progress.current >= 1) {
      idleRotation.current += delta * 0.025;
    }

    // Restrained: whole-group tilt only, no more than a couple of degrees.
    groupRef.current.rotation.x = -0.05 + scrollOffset * 0.06 + pointer.y * 0.02;
    groupRef.current.rotation.y = -0.1 + idleRotation.current + scrollOffset * 0.12 + pointer.x * 0.025;
  });

  return (
    <group ref={groupRef} position={[0.6, -0.1, 0]} scale={0.72}>
      {FRAGMENTS.map((fragment, i) => (
        <FragmentMesh key={i} fragment={fragment} progress={progress} />
      ))}
      {CONNECTOR_PAIRS.map(([fromIndex, toIndex], i) => (
        <Connector key={i} from={FRAGMENTS[fromIndex]} to={FRAGMENTS[toIndex]} progress={progress} />
      ))}
    </group>
  );
}
