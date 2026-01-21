'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { useControls, button, Leva } from 'leva';

const PARTICLE_COUNT = 3000;
const STORAGE_KEY = 'particle-background-params';

// デフォルト値（コードに反映する際はここを更新）
const DEFAULTS = {
  noise: {
    noiseEnabled: true,
    noiseScale: 0.04,
    noiseSpeed: 0.0017,
    noiseStrength: 0.05,
    noiseStrengthY: 0.041,
    particleSize: 0.5,
    opacity: 0.2,
  },
  field: {
    fieldSize: 100,
    fieldHeight: 5,
  },
  camera: {
    cameraX: 95,
    cameraY: 0,
    fov: 60,
  },
  dof: {
    enabled: true,
    focusDistance: 65,
    focusRange: 10,
    bokehScale: 3,
  },
};

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function usePersistedControls<T extends Record<string, unknown>>(
  name: string,
  schema: Parameters<typeof useControls>[1],
  defaultValues: T
) {
  const saved = loadFromStorage();
  const initial = saved?.[name] || defaultValues;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaWithDefaults: any = {};
  for (const [key, config] of Object.entries(schema as Record<string, unknown>)) {
    if (typeof config === 'object' && config !== null && 'value' in config) {
      schemaWithDefaults[key] = { ...config, value: initial[key] ?? (config as { value: unknown }).value };
    } else {
      schemaWithDefaults[key] = config;
    }
  }

  const values = useControls(name, schemaWithDefaults);

  useEffect(() => {
    const current = loadFromStorage() || {};
    current[name] = values;
    saveToStorage(current);
  }, [name, values]);

  return values as T;
}

function ExportControls() {
  useControls('Export', {
    'Copy JSON': button(() => {
      const data = loadFromStorage();
      const json = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(json);
      console.log('Copied to clipboard:\n', json);
      alert('JSONをクリップボードにコピーしました');
    }),
    'Reset to Defaults': button(() => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }),
  });
  return null;
}

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);
  const timeRef = useRef(0);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const { noiseEnabled, noiseScale, noiseSpeed, noiseStrength, noiseStrengthY, particleSize, opacity } =
    usePersistedControls('Noise', {
      noiseEnabled: { value: DEFAULTS.noise.noiseEnabled, label: 'Enable Noise' },
      noiseScale: { value: DEFAULTS.noise.noiseScale, min: 0.001, max: 0.1, step: 0.001 },
      noiseSpeed: { value: DEFAULTS.noise.noiseSpeed, min: 0.0001, max: 0.002, step: 0.0001 },
      noiseStrength: { value: DEFAULTS.noise.noiseStrength, min: 0.01, max: 0.2, step: 0.01 },
      noiseStrengthY: { value: DEFAULTS.noise.noiseStrengthY, min: 0.001, max: 0.1, step: 0.001 },
      particleSize: { value: DEFAULTS.noise.particleSize, min: 0.5, max: 5, step: 0.1 },
      opacity: { value: DEFAULTS.noise.opacity, min: 0.1, max: 1, step: 0.1 },
    }, DEFAULTS.noise);

  const { fieldSize, fieldHeight } = usePersistedControls('Field', {
    fieldSize: { value: DEFAULTS.field.fieldSize, min: 50, max: 300, step: 10 },
    fieldHeight: { value: DEFAULTS.field.fieldHeight, min: 5, max: 100, step: 5 },
  }, DEFAULTS.field);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * fieldSize;
      positions[i * 3 + 1] = (Math.random() - 0.5) * fieldHeight;
      positions[i * 3 + 2] = (Math.random() - 0.5) * fieldSize;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, [fieldSize, fieldHeight]);

  useFrame(() => {
    if (!meshRef.current || !noiseEnabled) return;

    timeRef.current += 1;
    const positionAttr = meshRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      const noiseX = noise3D(x * noiseScale, y * noiseScale, timeRef.current * noiseSpeed);
      const noiseY = noise3D(y * noiseScale, z * noiseScale, timeRef.current * noiseSpeed + 100);
      const noiseZ = noise3D(z * noiseScale, x * noiseScale, timeRef.current * noiseSpeed + 200);

      posArray[i3] += noiseX * noiseStrength;
      posArray[i3 + 1] += noiseY * noiseStrengthY;
      posArray[i3 + 2] += noiseZ * noiseStrength;
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
        size={particleSize}
        color="#ffffff"
        map={circleTexture}
        transparent
        opacity={opacity}
        alphaTest={0.1}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={true}
      />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { cameraX, cameraY, fov } = usePersistedControls('Camera', {
    cameraX: { value: DEFAULTS.camera.cameraX, min: 20, max: 150, step: 5 },
    cameraY: { value: DEFAULTS.camera.cameraY, min: -50, max: 50, step: 5 },
    fov: { value: DEFAULTS.camera.fov, min: 30, max: 120, step: 5 },
  }, DEFAULTS.camera);

  useEffect(() => {
    camera.position.set(cameraX, cameraY, 0);
    (camera as THREE.PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera, cameraX, cameraY, fov]);

  return null;
}

function Effects() {
  const { enabled, focusDistance, focusRange, bokehScale } = usePersistedControls('Depth of Field', {
    enabled: { value: DEFAULTS.dof.enabled, label: 'Enable DOF' },
    focusDistance: { value: DEFAULTS.dof.focusDistance, min: 10, max: 150, step: 5 },
    focusRange: { value: DEFAULTS.dof.focusRange, min: 10, max: 100, step: 5 },
    bokehScale: { value: DEFAULTS.dof.bokehScale, min: 1, max: 10, step: 0.5 },
  }, DEFAULTS.dof);

  if (!enabled) return null;

  return (
    <EffectComposer>
      <DepthOfField
        worldFocusDistance={focusDistance}
        worldFocusRange={focusRange}
        bokehScale={bokehScale}
      />
    </EffectComposer>
  );
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Leva hidden={process.env.NODE_ENV === 'production'} collapsed={false} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100svh',
          zIndex: -1,
        }}
      >
        <Canvas
          camera={{
            position: [60, 0, 0],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={['#111111']} />
          <CameraController />
          <Particles />
          <Effects />
          <ExportControls />
        </Canvas>
      </div>
    </>
  );
}
