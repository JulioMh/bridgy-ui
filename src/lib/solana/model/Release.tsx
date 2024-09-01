import * as anchor from "@coral-xyz/anchor";

export interface Release {
  amount: anchor.BN;
  timestamp: anchor.BN;
  mint: anchor.web3.PublicKey;
  to: anchor.web3.PublicKey;
}

export const serialize = (release: Release) => {
  const buffer = Buffer.alloc(8 + 8 + 32);

  buffer.writeBigUInt64LE(BigInt(release.amount.toNumber()), 0);

  buffer.writeBigUInt64LE(BigInt(release.timestamp.toNumber()), 8);

  const mintBuffer = release.mint.toBuffer();
  mintBuffer.copy(buffer, 16);

  const toBuffer = release.to.toBuffer();
  toBuffer.copy(buffer, 48);

  return buffer;
};
