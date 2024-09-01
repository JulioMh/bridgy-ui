import * as anchor from "@coral-xyz/anchor";
import { Authority } from "./Authority";
import { PublicKey } from "@solana/web3.js";

export interface Pool {
  bump: number;
  fee: anchor.BN;
  splitFees: anchor.BN;
  otherChainTokenAddress: string;
  authority: Authority;
  ata: PublicKey;
  token: PublicKey;
  isPublic: boolean;
  tokenSymbol: string;
}
