import { PublicKey } from "@solana/web3.js";
import { Keypair } from "stellar-sdk";

export const isValidSolanaPublicKey = (publicKeyString: string): boolean => {
  try {
    new PublicKey(publicKeyString);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidStellarAddress = (address: string): boolean => {
  try {
    Keypair.fromPublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};
