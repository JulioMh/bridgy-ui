"use client";

import { useCallback, useEffect } from "react";

import { useStellarStore } from "@/lib/store/stellar";
import { freighter } from "@/lib/stellar/freighter";
import { StellarContract } from "@/lib/stellar";
import { StellarUtils } from "@/lib/stellar/utils";
import { getPublicKey, isConnected } from "@stellar/freighter-api";
import { useNotify } from "@/lib/hooks/useNotify";

export const StellarProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { pubKey, setClient, setIsAdmin, setPubKey } = useStellarStore();
  const notify = useNotify();
  const initialize = useCallback(async () => {
    if (!pubKey) return;
    const connection = freighter();
    const networkDetails = await connection.getNetworkDetails();
    const newClient = new StellarContract({
      publicKey: pubKey,
      networkDetails,
    });
    const getAdminTxn = await newClient.deployer.get_admin();

    const admin_val = await newClient.utils.fetchContractValue(getAdminTxn);
    const admin = StellarUtils.scValToAuthority(admin_val);
    if (admin.signer === pubKey) {
      setIsAdmin(true);
    }
    setClient(newClient);
  }, [pubKey, setClient, setIsAdmin]);

  useEffect(() => {
    // Try to auto-connect if the wallet is already connected
    const connectStellarWallet = async () => {
      try {
        if (await isConnected()) {
          const pubKey = await getPublicKey();
          if (!pubKey.length)
            notify("info", "Open Freighter and input your password");
          else {
            setPubKey(pubKey);
          }
        } else {
          notify("warning", "Freighter is not connected.");
        }
      } catch (error) {
        notify("error", "Freighter is not connected.");
      }
    };

    connectStellarWallet();
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize, pubKey]);

  return children;
};
