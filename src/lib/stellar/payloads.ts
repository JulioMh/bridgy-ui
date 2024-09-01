import { u32 } from "stellar-sdk/contract";

export interface Authority {
  fee_wallet: string;
  signer: string;
}

export interface CreatePoolPayload {
  deployer: string;
  token: string;
  other_chain_address: string;
  fee: u32;
  is_public: boolean;
  split_fees: u32;
  owner: Partial<Authority>;
  token_symbol: string;
}
