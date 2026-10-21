import { useSyncExternalStore } from "react";

/**
 * Мутируемый стор вне React: GSAP пишет в него на скролле,
 * а 3D-сцена читает в useFrame без ререндеров.
 */
export const store = {
  jar: {
    /** -1..1 — доля половины ширины вьюпорта */
    x: 0,
    scale: 1,
    spin: 0,
    /** 0..1 — насколько поднята крышка */
    lid: 0,
    /** 0..1 — интро после прелоадера */
    intro: 0,
  },
  pointer: { x: 0, y: 0 },
  velocity: 0,
  flavor: 0,
  /** Всплеск частиц при смене вкуса, затухает в сцене */
  burst: 0,
  paused: false,
  /** Шейдеры скомпилированы, первый кадр отрисован */
  sceneReady: false,
};

type Store = typeof store;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function setFlavor(i: number) {
  if (store.flavor === i) return;
  store.flavor = i;
  store.burst = 1;
  emit();
}

export function setPaused(p: boolean) {
  if (store.paused === p) return;
  store.paused = p;
  emit();
}

export function useStoreValue<T>(selector: (s: Store) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(store),
    () => selector(store),
  );
}
