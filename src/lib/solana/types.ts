import { Authority } from "@/lib/solana/model/Authority";
import { Lock } from "@/lib/solana/model/Lock";
import { Release } from "@/lib/solana/model/Release";
import { Coupon } from "@/utils/coupons";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export interface CreateTokenPayload {
  timestamp: anchor.BN;
  name: string;
  uri: string;
  symbol: string;
  decimals: number;
  totalSupply: anchor.BN;
  revokeAuthority: boolean;
  mintSupply: boolean;
  authority: anchor.web3.PublicKey;
}

export interface CreatePoolPayload {
  mint: PublicKey;
  timestamp: anchor.BN;
  amount: anchor.BN;
  fee: anchor.BN;
  splitFee: anchor.BN;
  tokenAddress: string;
  authority: Partial<Authority>;
  isPublic: boolean;
}

export interface InitPayload {
  signer: PublicKey;
  be: number[];
  feeWallet: PublicKey;
}

export type LockLiqPayload = Lock;
export type ReleaseLiqPayload = { release: Release; coupon: Coupon };

export const isCompleted = (
  object: Partial<CreateTokenPayload> | Partial<CreatePoolPayload>
) =>
  Object.keys(object).every((key: any) => {
    const value = object[key as keyof object];
    const type = typeof value;
    if (type === "boolean") return true;

    return Boolean(value);
  });
