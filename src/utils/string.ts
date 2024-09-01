import { PublicKey } from "@solana/web3.js";

export const shortify = (st: string): string => {
  return `${st.slice(0, 4)}...${st.slice(st.length - 4, st.length)}`;
};
