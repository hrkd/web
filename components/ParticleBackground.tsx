'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { useControls, button, Leva } from 'leva';

const PARTICLE_COUNT = 3000;
const STORAGE_KEY = 'particle-background-params';

// SP/PC判定用のアスペクト比閾値
const ASPECT_THRESHOLD = 1.0;
// SP用のfieldHeight最大値
const SP_FIELD_HEIGHT_MAX = 15;
// PC用のfieldHeight
const PC_FIELD_HEIGHT = 5;

// 初回マウント時のアスペクト比を取得するhook（リサイズ非対応）
function useWindowAspect() {
  const [aspect] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth / window.innerHeight;
  });
  return aspect;
}

// アスペクト比に基づいて動的にfieldHeightを計算
function calcDynamicFieldHeight(aspect: number): number {
  if (aspect >= ASPECT_THRESHOLD) {
    // PC（横長）: 固定値
    return PC_FIELD_HEIGHT;
  }
  // SP（縦長）: アスペクト比が小さいほど大きく
  // aspect=0.5 → 15, aspect=1.0 → 5
  const t = aspect / ASPECT_THRESHOLD;
  return PC_FIELD_HEIGHT + (SP_FIELD_HEIGHT_MAX - PC_FIELD_HEIGHT) * (1 - t);
}

// デフォルト値（コードに反映する際はここを更新）
const DEFAULTS = {
  noise: {
    noiseEnabled: true,
    noiseScale: 0.031,
    noiseSpeed: 0.002,
    noiseStrength: 8.3,
    noiseStrengthY: 15.9,
    particleSize: 0.5,
    opacity: 0.2,
  },
  field: {
    fieldSize: 100,
    // fieldHeightはスクリーンサイズに応じて動的に計算される
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

  // スクリーンのアスペクト比を監視
  const aspect = useWindowAspect();
  const dynamicFieldHeight = calcDynamicFieldHeight(aspect);

  const { noiseEnabled, noiseScale, noiseSpeed, noiseStrength, noiseStrengthY, particleSize, opacity } =
    usePersistedControls('Noise', {
      noiseEnabled: { value: DEFAULTS.noise.noiseEnabled, label: 'Enable Noise' },
      noiseScale: { value: DEFAULTS.noise.noiseScale, min: 0.001, max: 0.1, step: 0.001 },
      noiseSpeed: { value: DEFAULTS.noise.noiseSpeed, min: 0.0001, max: 0.002, step: 0.0001 },
      noiseStrength: { value: DEFAULTS.noise.noiseStrength, min: 0.01, max: 100, step: 0.1 },
      noiseStrengthY: { value: DEFAULTS.noise.noiseStrengthY, min: 0.01, max: 100, step: 0.1 },
      particleSize: { value: DEFAULTS.noise.particleSize, min: 0.5, max: 5, step: 0.1 },
      opacity: { value: DEFAULTS.noise.opacity, min: 0.1, max: 1, step: 0.1 },
    }, DEFAULTS.noise);

  const { fieldSize } = usePersistedControls('Field', {
    fieldSize: { value: DEFAULTS.field.fieldSize, min: 50, max: 300, step: 10 },
  }, DEFAULTS.field);

  // 動的に計算されたfieldHeightを使用
  const fieldHeight = dynamicFieldHeight;

  const { positions, originalPositions, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * fieldSize;
      const y = (Math.random() - 0.5) * fieldHeight;
      const z = (Math.random() - 0.5) * fieldSize;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 初期位置を保持（波打ち動作の基準点）
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, originalPositions, sizes };
  }, [fieldSize, fieldHeight]);

  useFrame(() => {
    if (!meshRef.current || !noiseEnabled) return;

    timeRef.current += 1;
    const positionAttr = meshRef.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // 初期位置を基準にノイズを計算
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      const noiseX = noise3D(origX * noiseScale, origY * noiseScale, timeRef.current * noiseSpeed);
      const noiseY = noise3D(origY * noiseScale, origZ * noiseScale, timeRef.current * noiseSpeed + 100);
      const noiseZ = noise3D(origZ * noiseScale, origX * noiseScale, timeRef.current * noiseSpeed + 200);

      // 初期位置 + ノイズオフセット（累積しないので拡散しない）
      posArray[i3] = origX + noiseX * noiseStrength;
      posArray[i3 + 1] = origY + noiseY * noiseStrengthY;
      posArray[i3 + 2] = origZ + noiseZ * noiseStrength;
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
