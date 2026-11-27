"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  activateCustomer,
  addNote,
  applyApplication,
  applyCollection,
  applyMessage,
  applyPayment,
  approveApplication,
  approveCharge,
  rejectCharge,
  toggleAutopay,
} from "@/lib/reduce";
import { createSeed } from "@/lib/seed";
import type {
  ApplicationDraft,
  ApplicationResult,
  CollectionInput,
  CollectionResult,
  DemoState,
  Payment,
  Role,
} from "@/lib/types";

const STORAGE_KEY = "adams-demo-v1";

type DemoApi = {
  state: DemoState;
  hydrated: boolean;
  reset: () => void;
  setRole: (role: Role) => void;
  submitApplication: (draft: ApplicationDraft) => ApplicationResult;
  approveApplication: (applicationId: string) => void;
  activateCustomer: (customerId: string) => void;
  addNote: (customerId: string, body: string) => void;
  submitCollection: (input: CollectionInput) => CollectionResult;
  approveCharge: (chargeId: string) => void;
  rejectCharge: (chargeId: string) => void;
  payInvoice: (invoiceId: string, method: Payment["method"]) => void;
  toggleAutopay: (customerId: string) => void;
  sendMessage: (input: { name: string; email: string; phone: string; topic: string; body: string }) => void;
};

const DemoContext = createContext<DemoApi | null>(null);

function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DemoState>;
  return (
    record.version === 1 &&
    Array.isArray(record.customers) &&
    Array.isArray(record.invoices) &&
    Array.isArray(record.stops) &&
    Array.isArray(record.applications) &&
    Array.isArray(record.charges) &&
    Array.isArray(record.payments)
  );
}

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();
    const parsed: unknown = JSON.parse(raw);
    if (isDemoState(parsed)) return parsed;
  } catch {
    // Sample data is the fallback when storage is unreadable.
  }
  return createSeed();
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(createSeed);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  const dirty = useRef(false);

  useEffect(() => {
    if (dirty.current) {
      setHydrated(true);
      return;
    }
    const loaded = loadState();
    stateRef.current = loaded;
    setState(loaded);
    setHydrated(true);
  }, []);

  function commit(next: DemoState) {
    dirty.current = true;
    stateRef.current = next;
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const api: DemoApi = {
    state,
    hydrated,
    reset() {
      const fresh = createSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      stateRef.current = fresh;
      setState(fresh);
    },
    setRole(role) {
      commit({ ...stateRef.current, role });
    },
    submitApplication(draft) {
      const out = applyApplication(stateRef.current, draft);
      commit(out.state);
      return out.result;
    },
    approveApplication(applicationId) {
      commit(approveApplication(stateRef.current, applicationId));
    },
    activateCustomer(customerId) {
      commit(activateCustomer(stateRef.current, customerId));
    },
    addNote(customerId, body) {
      commit(addNote(stateRef.current, customerId, body));
    },
    submitCollection(input) {
      const out = applyCollection(stateRef.current, input);
      commit(out.state);
      return out.result;
    },
    approveCharge(chargeId) {
      commit(approveCharge(stateRef.current, chargeId));
    },
    rejectCharge(chargeId) {
      commit(rejectCharge(stateRef.current, chargeId));
    },
    payInvoice(invoiceId, method) {
      commit(applyPayment(stateRef.current, invoiceId, method));
    },
    toggleAutopay(customerId) {
      commit(toggleAutopay(stateRef.current, customerId));
    },
    sendMessage(input) {
      commit(applyMessage(stateRef.current, input));
    },
  };

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
