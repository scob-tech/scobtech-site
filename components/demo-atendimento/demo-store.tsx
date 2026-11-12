"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { createInitialState, PROFILES } from "@/lib/demo-atendimento/data";
import { reduce, type DemoAction } from "@/lib/demo-atendimento/engine";
import type { DemoState, Profile } from "@/lib/demo-atendimento/types";

/**
 * Estado isolado da demonstração. Fica só em memória, dentro deste provider:
 * não toca no restante da aplicação, em armazenamento nem em rede.
 */
interface DemoContextValue {
  state: DemoState;
  dispatch: (a: DemoAction) => void;
  profile: Profile;
  setProfileId: (id: string) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, createInitialState);
  const [profileId, setProfileId] = useState(PROFILES[0].id);
  const profile = PROFILES.find((p) => p.id === profileId) ?? PROFILES[0];

  const reset = useCallback(() => {
    dispatch({ type: "reset", state: createInitialState() });
    setProfileId(PROFILES[0].id);
  }, []);

  const value = useMemo(() => ({ state, dispatch, profile, setProfileId, reset }), [state, profile, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo precisa estar dentro de <DemoProvider>");
  return ctx;
}
