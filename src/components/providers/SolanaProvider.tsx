"use client";

import { useCallback, useEffect } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useNotify } from "@/lib/hooks/useNotify";
import {
  AnchorProvider,
  Idl,
  Program,
  Provider,
  getProvider,
} from "@coral-xyz/anchor";
import idl from "../../dogstar_bridge.json";
import { useSolanaStore } from "@/lib/store/solana";
import { SolanaProgram } from "@/lib/solana";

export const SolanaProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { connection } = useConnection();
  const notify = useNotify();
  const wallet = useAnchorWallet();

  const clientExists = useSolanaStore((state) => state.client);
  const { setClient, setIsAdmin, setPubKey, disconnect } = useSolanaStore(
    (state) => state
  );

  const initialize = useCallback(
    async (client: SolanaProgram): Promise<void> => {
      if (!wallet?.publicKey) return;
      const admin = await client.query.getAdmin();
      if (admin?.signer.equals(wallet.publicKey)) {
        setIsAdmin(true);
      }
      setClient(client);
      setPubKey(wallet.publicKey);
    },
    [wallet]
  );

  const disconnectCallback = useCallback(disconnect, [wallet]);

  useEffect(() => {
    if (clientExists && !wallet) {
      disconnectCallback();
      return;
    }
    let provider: Provider;
    if (!wallet) return;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
    }

    const program = new Program(idl as Idl, provider);
    const client = SolanaProgram.getSolanaProgram(program, wallet, {
      notify,
    });

    initialize(client);
  }, [clientExists, connection, wallet, notify, initialize]);

  return children;
};
