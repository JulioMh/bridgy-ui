import { Pool as PoolSolana } from "@/lib/solana/model/Pool";
import { Authority as AuthoritySolana } from "@/lib/solana/model/Authority";
import { Pool } from "@/models/Pool";
import { Authority } from "@/models/Authority";

export const adaptAuthority = (authority: AuthoritySolana): Authority => {
  return {
    signer: authority.signer.toBase58(),
    feeWallet: authority.feeWallet.toBase58(),
  };
};

export const adaptPool = (pool: PoolSolana): Pool => {
  return {
    fee: pool.fee,
    splitFees: pool.splitFees,
    otherChainAddress: pool.otherChainTokenAddress,
    authority: adaptAuthority(pool.authority),
    ata: pool.ata.toBase58(),
    token: pool.token.toBase58(),
    isPublic: pool.isPublic,
    tokenSymbol: pool.tokenSymbol,
  };
};
