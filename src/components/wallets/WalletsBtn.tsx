"use client";

import { useState } from "react";
import "./wallet.css";
import WalletModal from "./SolanaModal";
import { useSolanaStore } from "@/lib/store/solana";
import { shortify } from "@/utils/string";
import { useStellarStore } from "@/lib/store/stellar";
import { SiSolana, SiStellar } from "react-icons/si"; // Icono de Solana
import StellarBtn from "./StellarBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaBtn } from "./SolanaBtn";

export const WalletsBtn = () => {
  return (
    <div className="flex flex-col w-full pr-8 items-center">
      <SolanaBtn />
      <StellarBtn />
    </div>
  );
};
