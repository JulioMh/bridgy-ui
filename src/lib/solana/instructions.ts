import { Idl, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { TxnSignature } from "./txn_signature";
import * as anchor from "@coral-xyz/anchor";
import { StateManagers } from ".";
import { PublicKey } from "@solana/web3.js";
import {
  CreatePoolPayload,
  CreateTokenPayload,
  InitPayload,
  LockLiqPayload,
  ReleaseLiqPayload,
} from "./types";
import { Authority } from "@/lib/solana/model/Authority";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export class Instructions {
  private static instance: Instructions;
  private program: Program<Idl>;
  private wallet: AnchorWallet;
  private state: StateManagers;

  private constructor(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ) {
    this.program = program;
    this.wallet = wallet;
    this.state = state;
  }

  private async guard(fn: () => Promise<string>) {
    try {
      const sig = await fn();
      return new TxnSignature(this.program, sig, this.state);
    } catch (e: any) {
      console.log(e);
      this.state.notify("error", e.error.errorMessage ?? e.error.message);
    }
  }

  async init(payload: InitPayload) {
    return this.guard(() =>
      this.program.methods
        .init(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setSigner(payload: PublicKey) {
    return this.guard(() =>
      this.program.methods
        .setSigner(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setBe(payload: number[]) {
    return this.guard(() =>
      this.program.methods
        .setBe(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setFeeWallet(payload: PublicKey) {
    return this.guard(() =>
      this.program.methods
        .setFeeWallet(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async createToken(payload: CreateTokenPayload) {
    const [mintPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("token"),
        payload.authority.toBuffer(),
        Buffer.from(payload.symbol),
      ],
      this.program.programId
    );
    const [metadataPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPda.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    return this.guard(() =>
      this.program.methods
        .createToken(payload)
        .accounts({
          metadata: metadataPda,
          userAta: anchor.utils.token.associatedAddress({
            mint: mintPda,
            owner: this.wallet.publicKey,
          }),
          authority: payload.authority,
        })
        .rpc()
    );
  }

  async createPool(payload: CreatePoolPayload) {
    const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), payload.mint.toBuffer()],
      this.program.programId
    );
    return this.guard(() =>
      this.program.methods
        .createPool(payload)
        .accounts({
          mint: payload.mint,
          poolAta: anchor.utils.token.associatedAddress({
            mint: payload.mint,
            owner: poolPda,
          }),
          userAta: anchor.utils.token.associatedAddress({
            mint: payload.mint,
            owner: this.wallet.publicKey,
          }),
        })
        .rpc()
    );
  }

  async lockLiq(payload: LockLiqPayload) {
    return this.guard(() =>
      this.program.methods
        .lockLiq(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async releaseLiq(payload: ReleaseLiqPayload) {
    return this.guard(() =>
      this.program.methods
        .releaseLiq(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setIsPublic(payload: boolean) {
    return this.guard(() =>
      this.program.methods
        .setIsPublic(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setAuthority(payload: Authority) {
    return this.guard(() =>
      this.program.methods
        .setAuthority(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setOtherChainAddress(payload: string) {
    return this.guard(() =>
      this.program.methods
        .setOtherChainAddress(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  async setFee(payload: anchor.BN) {
    return this.guard(() =>
      this.program.methods
        .setFee(payload)
        .accounts({
          // Specify accounts required for this instruction
        })
        .rpc()
    );
  }

  static getInstructions(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ): Instructions {
    if (!Instructions.instance) {
      Instructions.instance = new Instructions(program, wallet, state);
    }

    return Instructions.instance;
  }
}
