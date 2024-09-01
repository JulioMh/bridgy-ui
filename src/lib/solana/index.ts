import { Idl, Program, Wallet } from "@coral-xyz/anchor";
import { Instructions } from "./instructions";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Query } from "./query";
import { Notify } from "../hooks/useNotify";
export type StateManagers = {
  notify: Notify;
};

export class SolanaProgram {
  private static instance: SolanaProgram;
  public instructions: Instructions;
  public query: Query;

  private constructor(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ) {
    this.instructions = Instructions.getInstructions(program, wallet, state);
    this.query = Query.getQuery(program);
  }

  static getSolanaProgram(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ): SolanaProgram {
    if (!SolanaProgram.instance) {
      SolanaProgram.instance = new SolanaProgram(program, wallet, state);
    }

    return SolanaProgram.instance;
  }
}
