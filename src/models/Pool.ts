import { Authority } from "./Authority";

export interface Pool {
  fee: number;
  splitFees: number;
  otherChainAddress: string;
  authority: Authority;
  ata?: string;
  token: string;
  isPublic: boolean;
  tokenSymbol: string;
  contractId?: string;
}
