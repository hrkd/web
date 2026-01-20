'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const PARTICLE_COUNT = 2000;
const FIELD_SIZE = 50;
const NOISE_SCALE = 0.02;
const NOISE_SPEED = 0.0003;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);
  const timeRef = useRef(0);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * FIELD_SIZE;
      positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_SIZE;
      positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_SIZE;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    timeRef.current += 1;
    const positionAttr = meshRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      const noiseX = noise3D(x * NOISE_SCALE, y * NOISE_SCALE, timeRef.current * NOISE_SPEED);
      const noiseY = noise3D(y * NOISE_SCALE, z * NOISE_SCALE, timeRef.current * NOISE_SPEED + 100);
      const noiseZ = noise3D(z * NOISE_SCALE, x * NOISE_SCALE, timeRef.current * NOISE_SPEED + 200);

      posArray[i3] += noiseX * 0.05;
      posArray[i3 + 1] += noiseY * 0.05;
      posArray[i3 + 2] += noiseZ * 0.05;

      // Boundary wrap
      if (posArray[i3] > FIELD_SIZE / 2) posArray[i3] = -FIELD_SIZE / 2;
      if (posArray[i3] < -FIELD_SIZE / 2) posArray[i3] = FIELD_SIZE / 2;
      if (posArray[i3 + 1] > FIELD_SIZE / 2) posArray[i3 + 1] = -FIELD_SIZE / 2;
      if (posArray[i3 + 1] < -FIELD_SIZE / 2) posArray[i3 + 1] = FIELD_SIZE / 2;
      if (posArray[i3 + 2] > FIELD_SIZE / 2) posArray[i3 + 2] = -FIELD_SIZE / 2;
      if (posArray[i3 + 2] < -FIELD_SIZE / 2) posArray[i3 + 2] = FIELD_SIZE / 2;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffc729"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Canvas
        camera={{
          position: [80, 0, 0],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#111111']} />
        <Particles />
        <EffectComposer>
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.02}
            bokehScale={6}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
