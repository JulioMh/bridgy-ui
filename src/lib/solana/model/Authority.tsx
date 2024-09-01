import { PublicKey } from "@solana/web3.js";

export interface Authority {
  signer: PublicKey;
  feeWallet: PublicKey;
}
