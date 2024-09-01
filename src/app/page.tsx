"use client";

import { Loading } from "@/components/ux/Loading";
import { useNotify } from "@/lib/hooks/useNotify";
import { useStellarPool } from "@/lib/hooks/useStellarPool";
import { useSolanaStore } from "@/lib/store/solana";
import { useStellarStore } from "@/lib/store/stellar";
import { Pool } from "@/models/Pool";
import { shortify } from "@/utils/string";
import { isValidSolanaPublicKey } from "@/utils/validator";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { scValToBigInt } from "stellar-sdk";

function isValidNumber(value: string): boolean {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(value);
}

const BridgeForm = () => {
  const notify = useNotify();
  const [from, setFrom] = useState<"fromSolana" | "fromStellar">("fromStellar");
  const [balance, setBalance] = useState("0.00");
  const [amountToBridge, setAmountToBridge] = useState("0.00");
  const [targetAddress, setTargetAddress] = useState<string | undefined>();
  const [locking, setLocking] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [pool, setPool] = useState<Pool | undefined>();
  const { pools } = useStellarPool();
  const { client, pubKey } = useStellarStore();
  const { pubKey: solanaPubKey, client: solanaClient } = useSolanaStore();

  useEffect(() => {
    if (!pool && pools.length) setPool(pools[0]);
  }, [pools, pool]);

  useEffect(() => {
    if (!targetAddress && solanaPubKey)
      setTargetAddress(solanaPubKey.toString());
  }, [targetAddress, solanaPubKey]);

  const fetchBalance = useCallback(async () => {
    try {
      if (!pool || !client || !pubKey) return;
      const balanceTxn = await client.token(pool.token).balance({ id: pubKey });
      const balance = await client.utils.fetchContractValue(balanceTxn);

      setBalance(scValToBigInt(balance).toString());
    } catch (e) {
      setBalance("0.00");
    }
  }, [pool, client, pubKey]);

  useEffect(() => {
    if (pool) fetchBalance();
  }, [pool, fetchBalance]);

  const onTokenSelection = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!pubKey || !client) {
      notify("info", "connect stellar wallet");
      return;
    }
    if (Number(e.target.value) === -1) return;
    const selectedPool = pools[Number(e.target.value)];
    setPool(selectedPool);
    setAmountToBridge("0.00");
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") setAmountToBridge("");
    if (isValidNumber(value.replace(/\.|\,/, ""))) setAmountToBridge(value);
  };

  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTargetAddress(value);
  };

  const isValid = () => {
    if (from === "fromStellar") {
      const amount = Number(amountToBridge);
      return (
        amount > 0 &&
        amount <= Number(balance) &&
        targetAddress &&
        isValidSolanaPublicKey(targetAddress.toString())
      );
    }
    return false;
  };

  const lockLiquidity = async () => {
    if (!client || !pool || !solanaClient) return;
    setLocking(true);
    console.log({
      from: pubKey!,
      amount: BigInt(amountToBridge),
    });
    const approve = await client.token(pool.token!).approve(
      {
        from: pubKey!,
        amount: BigInt(amountToBridge),
        spender: pool.contractId!,
        expiration_ledger: 500,
      },
      { simulate: true }
    );

    await client.utils.submit_txn(approve);
    const lockTxn = await client.pool(pool.contractId!).lock_liq(
      {
        user: pubKey!,
        amount: BigInt(amountToBridge),
        to_other_chain: targetAddress!,
      },
      { simulate: true }
    );
    await client.utils.submit_txn(lockTxn);

    setLocking(false);
    setReleasing(true);
    const response = await fetch("http://localhost:3000/api/solana", {
      method: "POST",
      body: JSON.stringify({
        amount: (Number(amountToBridge) * (100 - pool!.fee)) / 100,
        to: targetAddress,
        solanaToken: pool.otherChainAddress,
      }),
    });
    console.log(
      solanaClient.query.getBalance(new PublicKey(pool.otherChainAddress))
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center gap-2 mb-4">
        <button
          className={
            "flex-1 py-2 hover:bg-gray-300 rounded-md text-center " +
            (from === "fromStellar" ? "bg-gray-300" : "bg-gray-200")
          }
          onClick={() => setFrom("fromStellar")}
        >
          To Solana
        </button>
        <button
          className={
            "flex-1 py-2 hover:bg-gray-300 rounded-md text-center " +
            (from === "fromSolana" ? "bg-gray-300" : "bg-gray-200")
          }
          onClick={() => setFrom("fromSolana")}
        >
          To Stellar
        </button>
        <button className="ml-2 p-2 bg-gray-200 rounded-full">
          <span role="img" aria-label="settings">
            ⚙️
          </span>
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <div className="flex items-center justify-between mb-2">
          <input
            className="text-2xl bg-gray-100 border-none outline-none"
            value={amountToBridge}
            onChange={onAmountChange}
          />
          <div className="flex items-center space-x-2">
            <select className="bg-gray-100" onChange={onTokenSelection}>
              {pools.map((pool, index) => (
                <option value={index} key={index}>
                  {pool.tokenSymbol}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span>{from === "fromSolana" ? "From Solana" : "From Stellar"}</span>
          <span>
            Available: {balance}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() =>
                setAmountToBridge((Number(balance) / 2).toString())
              }
            >
              50%
            </span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setAmountToBridge(balance)}
            >
              {" "}
              MAX
            </span>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-2" htmlFor="stellar-address">
          {from === "fromSolana" ? "Stellar Address" : "Solana Address"}
        </label>
        <input
          id="stellar-address"
          type="text"
          placeholder={
            "Enter target " +
            (from === "fromSolana" ? "Stellar address" : "Solana address")
          }
          value={targetAddress}
          defaultValue={
            solanaPubKey ? shortify(solanaPubKey?.toString()) : undefined
          }
          onChange={onAddressChange}
          className="w-full p-2 border border-gray-300 rounded-md outline-none"
        />
      </div>
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <div className="flex justify-between mb-2">
          <span>{from === "fromSolana" ? "To Stellar" : "To Solana"}</span>
          <span>
            {(Number(amountToBridge) * (100 - (pool?.fee ?? 0))) / 100}{" "}
            {pool?.tokenSymbol}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Bridge Fee</span>
          <span>
            {(Number(amountToBridge) * (pool?.fee ?? 1)) / 100}{" "}
            {pool?.tokenSymbol}
          </span>
        </div>
      </div>
      {!locking || !releasing ? (
        <button
          className="w-full py-2 bg-purple-600 disabled:bg-purple-300 text-white rounded-md"
          disabled={!isValid()}
          onClick={lockLiquidity}
        >
          {!pubKey || !solanaPubKey ? "Connect to Wallet" : "Bridge"}
        </button>
      ) : (
        <button
          className="w-full py-2 bg-purple-500 text-white rounded-md"
          disabled={true}
          onClick={lockLiquidity}
        >
          {!releasing ? (
            <Loading text="releasing" />
          ) : (
            <Loading text="Locking" />
          )}
        </button>
      )}
    </div>
  );
};

export default BridgeForm;
