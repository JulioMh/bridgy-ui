import * as anchor from "@coral-xyz/anchor";

export interface Admin {
  signer: anchor.web3.PublicKey;
  be: number[];
  feeWallet: anchor.web3.PublicKey;
}
