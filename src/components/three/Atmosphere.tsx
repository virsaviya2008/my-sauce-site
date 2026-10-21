"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { flavors } from "@/lib/data";
import { store } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  Пар                                                                */
/* ------------------------------------------------------------------ */

const steamVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float life = fract(uTime * 0.11 * (0.7 + aSeed * 0.6) + aSeed * 7.13);
    vec3 p = position;
    p.y += life * 2.8;
    p.x += sin(life * 4.0 + aSeed * 20.0) * 0.28 * life + life * 0.3;
    p.z += cos(life * 3.0 + aSeed * 13.0) * 0.2 * life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(220.0, 1100.0, life) * (0.6 + aSeed * 0.6) * uPixelRatio / -mv.z;
    vAlpha = smoothstep(0.0, 0.18, life) * (1.0 - smoothstep(0.45, 1.0, life));
    vSeed = aSeed;
  }
`;

const steamFrag = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying float vAlpha;
  varying float vSeed;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float n = noise(uv * 3.5 + vSeed * 10.0 + uTime * 0.25) * 0.6 + noise(uv * 7.0 - uTime * 0.3) * 0.4;
    float a = smoothstep(0.5, 0.0, d) * n * vAlpha * uStrength;
    gl_FragColor = vec4(vec3(1.0, 0.94, 0.88), a * 0.2);
  }
`;

export function Steam() {
  const count = 54;
  const group = useRef<THREE.Group>(null!);
  const dpr = useThree((s) => s.viewport.dpr);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.38;
      pos.set([Math.cos(a) * r, Math.random() * 0.1, Math.sin(a) * r], i * 3);
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uStrength: { value: 0.5 } }),
    [],
  );

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPixelRatio.value = dpr;
    const l = store.jar.lid;
    const target = 0.55 + l * 1.1;
    uniforms.uStrength.value = THREE.MathUtils.damp(uniforms.uStrength.value, target, 3, dt);
    group.current.position.y = THREE.MathUtils.lerp(1.42, 1.18, l);
  });

  return (
    <group ref={group}>
      <points geometry={geo} renderOrder={10}>
        <shaderMaterial
          vertexShader={steamVert}
          fragmentShader={steamFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Частицы специй                                                     */
/* ------------------------------------------------------------------ */

type SpiceKind = {
  count: number;
  geometry: THREE.BufferGeometry;
  scale: [number, number, number];
  colors: string[];
  roughness: number;
  metalness?: number;
};

function SpiceSwarm({ kind }: { kind: SpiceKind }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const n = kind.count;
  const data = useMemo(() => {
    const d = {
      angle: new Float32Array(n),
      radius: new Float32Array(n),
      y: new Float32Array(n),
      speed: new Float32Array(n),
      phase: new Float32Array(n),
      spin: new Float32Array(n * 3),
      size: new Float32Array(n),
    };
    for (let i = 0; i < n; i++) {
      d.angle[i] = Math.random() * Math.PI * 2;
      d.radius[i] = 1.25 + Math.pow(Math.random(), 0.8) * 2.1;
      d.y[i] = -1.7 + Math.random() * 3.6;
      d.speed[i] = (0.05 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1);
      d.phase[i] = Math.random() * Math.PI * 2;
      d.spin.set([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], i * 3);
      d.size[i] = 0.6 + Math.random() * 0.8;
    }
    return d;
  }, [n]);

  useLayoutEffect(() => {
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) ref.current.setColorAt(i, c.set(kind.colors[i % kind.colors.length]));
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [kind, n]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const boost = 1 + store.burst * 9 + Math.min(Math.abs(store.velocity) * 0.04, 3);
    // Когда банка у края экрана — стягиваем облако, чтобы не мешать тексту
    const spread = 1 - Math.min(Math.abs(store.jar.x), 0.5) * 0.8;
    const { x: px, y: py } = store.pointer;
    for (let i = 0; i < n; i++) {
      data.angle[i] += data.speed[i] * dt * boost;
      const a = data.angle[i];
      const r = data.radius[i] * spread * (1 + store.burst * 0.25);
      const z = Math.sin(a) * r * 0.7 - 0.3;
      const depth = (z + 2.5) / 4;
      dummy.position.set(
        Math.cos(a) * r + px * 0.35 * depth,
        data.y[i] * (0.75 + spread * 0.25) + Math.sin(t * 0.6 + data.phase[i]) * 0.14 + py * 0.2 * depth,
        z,
      );
      const s = data.size[i];
      dummy.rotation.set(
        data.phase[i] + t * data.spin[i * 3] * 2 * boost,
        t * data.spin[i * 3 + 1] * 2,
        data.phase[i] + t * data.spin[i * 3 + 2],
      );
      dummy.scale.set(kind.scale[0] * s, kind.scale[1] * s, kind.scale[2] * s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[kind.geometry, undefined, n]} frustumCulled={false}>
      <meshPhysicalMaterial roughness={kind.roughness} metalness={kind.metalness ?? 0} clearcoat={0.3} />
    </instancedMesh>
  );
}

export function Spices() {
  const kinds = useMemo<SpiceKind[]>(() => {
    const flake = new THREE.IcosahedronGeometry(1, 0);
    const corn = new THREE.IcosahedronGeometry(1, 2);
    // лёгкая неровность для горошин перца
    const p = corn.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (Math.random() - 0.5) * 0.18;
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k);
    }
    corn.computeVertexNormals();
    return [
      { count: 36, geometry: flake, scale: [0.05, 0.011, 0.034], colors: ["#c2260a", "#e0430f", "#8a1a05", "#ff5a00"], roughness: 0.55 },
      { count: 18, geometry: corn, scale: [0.03, 0.03, 0.03], colors: ["#1b120c", "#2e1f15", "#120c08"], roughness: 0.75 },
      { count: 26, geometry: new THREE.SphereGeometry(1, 12, 8), scale: [0.024, 0.009, 0.015], colors: ["#f1dfb8", "#e6cd9a", "#fff1d6"], roughness: 0.45 },
      { count: 10, geometry: new THREE.OctahedronGeometry(1, 0), scale: [0.022, 0.026, 0.022], colors: ["#fff6ea"], roughness: 0.1, metalness: 0.1 },
    ];
  }, []);

  return (
    <group>
      {kinds.map((k, i) => (
        <SpiceSwarm key={i} kind={k} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Свечение за банкой и под ней                                       */
/* ------------------------------------------------------------------ */

const glowVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const glowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv - 0.5;
    float d = length(uv);
    float ang = atan(uv.y, uv.x);
    float rays = 0.85 + 0.15 * sin(ang * 9.0 + uTime * 0.4) * sin(ang * 5.0 - uTime * 0.3);
    float a = pow(smoothstep(0.5, 0.0, d), 2.4) * rays;
    float pulse = 0.88 + 0.08 * sin(uTime * 1.3) + 0.04 * sin(uTime * 3.7);
    gl_FragColor = vec4(uColor, a * uIntensity * pulse);
  }
`;

export function Glow({
  position,
  rotation,
  scale,
  intensity,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
  intensity: number;
}) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(flavors[0].glow) },
      uTime: { value: 0 },
      uIntensity: { value: intensity },
    }),
    [intensity],
  );
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uColor.value.lerp(tmp.set(flavors[store.flavor].glow), 1 - Math.exp(-dt * 3));
  });
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry />
      <shaderMaterial
        vertexShader={glowVert}
        fragmentShader={glowFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
