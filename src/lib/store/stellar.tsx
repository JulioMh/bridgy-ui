"use client";

import { create } from "zustand";
import { SolanaProgram } from "@/lib/solana";

import { Loading } from "@/components/ux/Loading";
import { Admin } from "@/lib/solana/model/Admin";
import { PublicKey } from "@solana/web3.js";
import { StellarContract } from "../stellar";

type State = {
  admin?: Admin;
  isAdmin: boolean;
  pubKey?: string;
  client?: StellarContract;
};
type Action = {
  setIsAdmin: (isAdmin: boolean) => void;
  setAdmin: (admin: Admin) => void;
  setPubKey: (pubkey?: string) => void;
  setClient: (client: StellarContract) => void;
  disconnect: () => void;
};

export const useStellarStore = create<State & Action>((set) => ({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => set((state) => ({ ...state, isAdmin })),
  setAdmin: (admin: Admin) => set((state) => ({ ...state, admin })),
  setPubKey: (pubKey?: string) => set((state) => ({ ...state, pubKey })),
  setClient: (client: StellarContract) =>
    set((state) => ({ ...state, client })),
  disconnect: () =>
    set(() => ({ isAdmin: false, pubKey: undefined, admin: undefined })),
}));
