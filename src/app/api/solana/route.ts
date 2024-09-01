import { Release } from "@/lib/solana/model/Release";
import { ReleaseLiqPayload } from "@/lib/solana/types";
import { Coupons } from "@/utils/coupons";
import * as anchor from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { NextRequest } from "next/server";
import idl from "../../../dogstar_bridge.json";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { amount, to, solanaToken } = body;

  // const events = getEvents();
  // if(!validate(events)) return 403;

  const release: Release = {
    amount: new anchor.BN(amount),
    timestamp: new anchor.BN(Date.now()),
    mint: new anchor.web3.PublicKey(solanaToken),
    to: new anchor.web3.PublicKey(to),
  };

  const coupon = Coupons.release(release);

  const releasePayload: ReleaseLiqPayload = {
    coupon,
    release,
  };
  const keypair = anchor.web3.Keypair.fromSecretKey(
    bs58.decode(process.env.ADMIN_PRIV_KEY!)
  );

  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(process.env.SOLANA_RPC_URL!),
    {} as unknown as anchor.Wallet
  );
  const program = new anchor.Program(idl as anchor.Idl, provider);

  const [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("pool"), release.mint.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .releaseLiq(releasePayload)
    .accounts({
      mint: release.mint,
      user: keypair.publicKey,
      userAta: anchor.utils.token.associatedAddress({
        mint: release.mint,
        owner: release.to,
      }),
      poolAta: anchor.utils.token.associatedAddress({
        mint: release.mint,
        owner: poolPda,
      }),
    })
    .signers([keypair])
    .rpc();

  await waitTxn({ tx, showLogs: true, program });

  return Response.json({ ok: "ok" });
};

const waitTxn = async ({ tx, showLogs = false, program }: any) => {
  const connection = program.provider.connection;

  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    },
    "confirmed"
  );

  const txDetails = await program.provider.connection.getTransaction(tx, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });
  const logs = txDetails?.meta?.logMessages || null;
  if (showLogs) {
    console.log(logs);
  }
  return logs;
};
