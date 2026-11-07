"use client";

import { useSyncExternalStore } from "react";

import {
  getCustomTemplates,
  getCustomTemplatesServerSnapshot,
  subscribeToCustomTemplates,
  type CustomTemplateConfig,
} from "./custom-template";
import { useIsClient } from "./use-resume-library";

/**
 * Subscribes to the locally stored custom templates so lists update after
 * create, rename, duplicate, or delete actions.
 */
export function useCustomTemplates(): CustomTemplateConfig[] {
  return useSyncExternalStore(
    subscribeToCustomTemplates,
    getCustomTemplates,
    getCustomTemplatesServerSnapshot,
  );
}

/**
 * Returns a custom template only after the client store is active, then reads
 * it synchronously. Re-reads when another tab changes local storage.
 */
export function useCustomTemplate(id: string | null): CustomTemplateConfig | null {
  const templates = useCustomTemplates();
  const isClient = useIsClient();

  if (!isClient || !id) return null;
  return templates.find((template) => template.id === id) ?? null;
}
