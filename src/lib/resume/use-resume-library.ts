"use client";

import { useSyncExternalStore } from "react";

import {
  getResumeLibraryServerSnapshot,
  getResumeLibrarySnapshot,
  subscribeToResumeLibrary,
  type ResumeLibrary,
} from "./persistence";

const subscribeToHydration = () => () => {};

export function useResumeLibrary(): ResumeLibrary {
  return useSyncExternalStore(
    subscribeToResumeLibrary,
    getResumeLibrarySnapshot,
    getResumeLibraryServerSnapshot,
  );
}

/**
 * Returns false during server rendering and the hydration pass, then true once
 * the client store is active. Used to avoid rendering client-only empty states
 * before stored data has been read.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}
