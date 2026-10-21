"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Preload } from "@react-three/drei";
import { store, useStoreValue } from "@/lib/store";
import { Jar } from "./Jar";
import { Glow, Spices, Steam } from "./Atmosphere";

const { damp } = THREE.MathUtils;

/** Сообщает прелоадеру, что сцена готова, — после пары отрисованных кадров */
function Ready() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => (store.sceneReady = true));
    });
    return () => cancelAnimationFrame(raf);
  }, [gl]);
  return null;
}

function Studio() {
  // Процедурное окружение — без внешних HDR; запекаем один раз, банка и так вращается
  return (
    <Environment resolution={128} frames={1}>
      <group>
        <Lightformer form="rect" intensity={5} color="#fff6ec" position={[-4, 1, 2.5]} scale={[1.1, 9, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[4, 1, 3]} scale={[0.45, 9, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ff5a00" position={[0, -2, -5]} scale={[7, 0.8, 1]} />
        <Lightformer form="ring" intensity={3} color="#ff8a1f" position={[3.5, 3, -3]} scale={1.4} />
        <Lightformer form="rect" intensity={1.6} color="#fff1e0" position={[0, 6, 0]} scale={[6, 6, 1]} />
      </group>
    </Environment>
  );
}

function KeyLight() {
  const key = useRef<THREE.SpotLight>(null!);
  useFrame((_, dt) => {
    const { x, y } = store.pointer;
    key.current.position.x = damp(key.current.position.x, -2.5 + x * 5, 2.5, dt);
    key.current.position.y = damp(key.current.position.y, 4 - y * 2.5, 2.5, dt);
  });
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight ref={key} position={[-2.5, 4, 5]} angle={0.55} penumbra={1} intensity={90} color="#fff2e2" />
    </>
  );
}

function JarRig() {
  const rig = useRef<THREE.Group>(null!);
  const spinner = useRef<THREE.Group>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  const idle = useRef(0);
  const kick = useRef({ value: 0, target: 0, flavor: store.flavor });

  useFrame((state, dt) => {
    const { jar, pointer } = store;
    const { width, aspect } = state.viewport;
    const t = state.clock.elapsedTime;
    const mobile = aspect < 0.85;
    const side = Math.min(Math.abs(jar.x) / 0.42, 1);

    // Позиция по секциям
    const tx = mobile ? 0 : (jar.x * width) / 2;
    // на десктопе чуть ниже центра — чтобы крышка не упиралась в шапку
    const ty = (mobile ? side * 0.95 : -0.12) - (1 - jar.intro) * 4.5;
    rig.current.position.x = damp(rig.current.position.x, tx, 3.2, dt);
    rig.current.position.y = damp(rig.current.position.y, ty, 3.2, dt);

    const base = mobile ? Math.min(width / 3.6, 0.85) : Math.min(0.82, width / 8.5);
    const s = base * jar.scale * (mobile ? 1 - side * 0.35 : 1) * (0.55 + 0.45 * jar.intro);
    rig.current.scale.setScalar(damp(rig.current.scale.x, s, 4, dt));

    // Наклон от курсора и скорости скролла
    const vel = THREE.MathUtils.clamp(store.velocity * 0.006, -0.25, 0.25);
    rig.current.rotation.x = damp(rig.current.rotation.x, pointer.y * 0.16 + vel, 3, dt);
    rig.current.rotation.z = damp(rig.current.rotation.z, -pointer.x * 0.08, 3, dt);

    // Вращение: холостое + скролл + рывок при смене вкуса
    idle.current += dt * (0.22 + Math.abs(store.velocity) * 0.004);
    if (kick.current.flavor !== store.flavor) {
      kick.current.flavor = store.flavor;
      kick.current.target += Math.PI * 2;
    }
    kick.current.value = damp(kick.current.value, kick.current.target, 3.2, dt);
    spinner.current.rotation.y =
      idle.current + jar.spin + kick.current.value + pointer.x * 0.35 - (1 - jar.intro) * Math.PI * 2;

    store.burst = damp(store.burst, 0, 1.6, dt);

    // Тлеющий контровой свет
    rim.current.intensity = 26 + Math.sin(t * 1.7) * 7 + Math.sin(t * 4.3) * 3 + Math.sin(t * 11.0) * 1.5;
    rim.current.position.set(Math.cos(t * 0.45) * 2.6, 0.6 + Math.sin(t * 0.7) * 0.5, -2 + Math.sin(t * 0.45) * 0.8);
  });

  return (
    <group ref={rig} position={[0, -4.5, 0]}>
      <pointLight ref={rim} intensity={26} color="#ff5a00" />
      <pointLight position={[0, -2, 1.8]} intensity={5} color="#ff8a1f" />
      <Glow position={[0, 0.15, -1.8]} scale={9.5} intensity={0.6} />
      <Glow position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={4.2} intensity={0.55} />
      <group ref={spinner}>
        <Jar />
      </group>
      <Steam />
      <Spices />
    </group>
  );
}

export default function Scene() {
  const paused = useStoreValue((s) => s.paused);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden>
      {/* Сцена не интерактивна: без этого холст перехватывает клики по sticky-секциям */}
      <Canvas
        style={{ pointerEvents: "none" }}
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.15, 6.4], fov: 35 }}
      >
        <Suspense fallback={null}>
          <Studio />
          <KeyLight />
          <JarRig />
          <Preload all />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  );
}
