"use client";

import { create } from "zustand";
import { SolanaProgram } from "@/lib/solana";

import { Loading } from "@/components/ux/Loading";
import { Admin } from "@/lib/solana/model/Admin";
import { PublicKey } from "@solana/web3.js";

type State = {
  client?: SolanaProgram;
  admin?: Admin;
  isAdmin: boolean;
  pubKey?: PublicKey;
};
type Action = {
  setClient: (client: SolanaProgram) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setAdmin: (admin: Admin) => void;
  setPubKey: (admin: PublicKey) => void;
  disconnect: () => void;
};

export const useSolanaStore = create<State & Action>((set) => ({
  isAdmin: false,
  setClient: (client: SolanaProgram) => set((state) => ({ ...state, client })),
  setIsAdmin: (isAdmin: boolean) => set((state) => ({ ...state, isAdmin })),
  setAdmin: (admin: Admin) => set((state) => ({ ...state, admin })),
  setPubKey: (pubKey: PublicKey) => set((state) => ({ ...state, pubKey })),
  disconnect: () =>
    set(() => ({
      isAdmin: false,
      client: undefined,
      admin: undefined,
      pubKey: undefined,
    })),
}));
