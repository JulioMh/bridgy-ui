import { PublicKey } from "@solana/web3.js";

export interface Token {
  mint: PublicKey;
  symbol: string;
}
