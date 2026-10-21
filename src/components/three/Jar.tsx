"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { flavors } from "@/lib/data";
import { store } from "@/lib/store";
import { createLabelTexture, createLidTexture, drawLabel, drawLid } from "./textures";

const LABEL_ARC = Math.PI * 1.3;
const GLASS_R = 0.85;

function glassProfile() {
  const p: THREE.Vector2[] = [new THREE.Vector2(0, -1.2), new THREE.Vector2(0.72, -1.2)];
  // скруглённое дно
  for (let i = 1; i <= 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * (Math.PI / 2);
    p.push(new THREE.Vector2(0.72 + Math.cos(a) * 0.13, -1.07 + Math.sin(a) * 0.13));
  }
  p.push(new THREE.Vector2(GLASS_R, 0.7));
  // плечо
  const shoulder = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(GLASS_R, 0.7),
    new THREE.Vector2(GLASS_R, 1.0),
    new THREE.Vector2(0.68, 1.02),
  );
  p.push(...shoulder.getPoints(12).slice(1));
  p.push(new THREE.Vector2(0.68, 1.12), new THREE.Vector2(0.71, 1.14), new THREE.Vector2(0.71, 1.2), new THREE.Vector2(0.64, 1.22));
  return p;
}

function sauceProfile(fill: number) {
  const p: THREE.Vector2[] = [new THREE.Vector2(0, -1.15), new THREE.Vector2(0.7, -1.15)];
  for (let i = 1; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
    p.push(new THREE.Vector2(0.7 + Math.cos(a) * 0.11, -1.04 + Math.sin(a) * 0.11));
  }
  // мениск
  p.push(
    new THREE.Vector2(0.81, fill),
    new THREE.Vector2(0.79, fill + 0.03),
    new THREE.Vector2(0.6, fill + 0.005),
    new THREE.Vector2(0, fill),
  );
  return p;
}

function knurledCap() {
  const geo = new THREE.CylinderGeometry(0.75, 0.75, 0.3, 360, 2, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    if (r > 0.74 && Math.abs(v.y) < 0.14) {
      const a = Math.atan2(v.z, v.x);
      const k = 1 + 0.016 * Math.pow(Math.abs(Math.sin(a * 60)), 0.6);
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** Хлопья перца и кунжут, прилипшие к стеклу изнутри */
function SauceSpecks() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const count = 110;
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    const c = new THREE.Color();
    const palette = ["#4a0d02", "#7a1804", "#1a0a04", "#f2dcae"];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.806;
      m.position.set(Math.sin(a) * r, -1.0 + Math.random() * 1.45, Math.cos(a) * r);
      m.rotation.set(0, a, Math.random() * Math.PI);
      const s = 0.012 + Math.random() * 0.022;
      m.scale.set(s, s * (0.4 + Math.random()), 0.003);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
      ref.current.setColorAt(i, c.set(palette[i % 7 === 0 ? 3 : i % 3]));
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  );
}

export function Jar() {
  const glassGeo = useMemo(() => new THREE.LatheGeometry(glassProfile(), 128), []);
  const sauceGeo = useMemo(() => new THREE.LatheGeometry(sauceProfile(0.52), 96), []);
  const capGeo = useMemo(knurledCap, []);
  const labels = useMemo(() => flavors.map(createLabelTexture), []);
  const lidTex = useMemo(createLidTexture, []);

  const sauceMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const labelMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const lid = useRef<THREE.Group>(null!);
  const shown = useRef(store.flavor);
  const swapAt = useRef(0);
  const target = useMemo(() => new THREE.Color(), []);

  // Перерисовываем, когда подгрузятся веб-шрифты
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      flavors.forEach((f, i) => {
        drawLabel(labels[i].image as HTMLCanvasElement, f);
        labels[i].needsUpdate = true;
      });
      drawLid(lidTex.image as HTMLCanvasElement);
      lidTex.needsUpdate = true;
    });
    return () => {
      alive = false;
    };
  }, [labels, lidTex]);

  useEffect(
    () => () => {
      labels.forEach((t) => t.dispose());
      lidTex.dispose();
      glassGeo.dispose();
      sauceGeo.dispose();
      capGeo.dispose();
    },
    [labels, lidTex, glassGeo, sauceGeo, capGeo],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const f = flavors[store.flavor];
    const k = 1 - Math.exp(-dt * 4);
    target.set(f.sauce);
    sauceMat.current.color.lerp(target, k);
    sauceMat.current.emissive.lerp(target, k);

    // Этикетку меняем в середине оборота
    if (shown.current !== store.flavor) {
      shown.current = store.flavor;
      swapAt.current = t + 0.22;
    }
    if (swapAt.current && t > swapAt.current) {
      labelMat.current.map = labels[shown.current];
      swapAt.current = 0;
    }

    const l = store.jar.lid;
    const e = 1 - Math.pow(1 - l, 3);
    lid.current.position.set(e * 0.75, 1.24 + e * 0.42, e * 0.3);
    lid.current.rotation.set(e * 0.5, e * 2.4, -e * 0.55);
  });

  return (
    <group>
      {/* Соус */}
      <mesh geometry={sauceGeo}>
        <meshPhysicalMaterial
          ref={sauceMat}
          color={flavors[0].sauce}
          emissive={flavors[0].sauce}
          emissiveIntensity={0.07}
          roughness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.12}
          envMapIntensity={0.3}
        />
      </mesh>
      <SauceSpecks />

      {/* Стекло */}
      <mesh geometry={glassGeo}>
        <MeshTransmissionMaterial
          samples={4}
          resolution={256}
          transmission={1}
          thickness={0.3}
          roughness={0.02}
          ior={1.48}
          chromaticAberration={0.06}
          anisotropicBlur={0.08}
          distortion={0.06}
          distortionScale={0.4}
          temporalDistortion={0.05}
          clearcoat={1}
          clearcoatRoughness={0.04}
          color="#fff8ef"
          attenuationColor="#ffe2c4"
          attenuationDistance={2.5}
          background={new THREE.Color("#140904")}
        />
      </mesh>

      {/* Этикетка */}
      <group position={[0, -0.27, 0]}>
        <mesh>
          <cylinderGeometry args={[GLASS_R + 0.012, GLASS_R + 0.012, 1.12, 160, 1, true, -LABEL_ARC / 2, LABEL_ARC]} />
          <meshPhysicalMaterial ref={labelMat} map={labels[0]} roughness={0.42} clearcoat={0.4} clearcoatRoughness={0.3} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[GLASS_R + 0.011, GLASS_R + 0.011, 1.12, 160, 1, true, -LABEL_ARC / 2, LABEL_ARC]} />
          <meshStandardMaterial color="#0d0907" side={THREE.BackSide} roughness={0.9} />
        </mesh>
      </group>

      {/* Крышка */}
      <group ref={lid} position={[0, 1.24, 0]}>
        <mesh geometry={capGeo}>
          <meshPhysicalMaterial color="#0c0a09" metalness={0.92} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
        <mesh position={[0, 0.151, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.73, 96]} />
          <meshPhysicalMaterial map={lidTex} metalness={0.55} roughness={0.32} clearcoat={1} clearcoatRoughness={0.15} />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.735, 0.022, 16, 160]} />
          <meshPhysicalMaterial color="#111" metalness={1} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.762, 0.012, 12, 160]} />
          <meshStandardMaterial color="#ff5a00" emissive="#ff5a00" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
