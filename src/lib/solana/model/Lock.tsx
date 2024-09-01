import * as anchor from "@coral-xyz/anchor";

export interface Lock {
  amount: anchor.BN;
  to: string;
  timestamp: anchor.BN;
}
