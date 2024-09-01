import { Address } from "stellar-sdk";

export interface Token {
  mint: Address;
  symbol: string;
}
