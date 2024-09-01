"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLoading } from "@/lib/hooks/useLoading";
import { useSolanaStore } from "@/lib/store/solana";
import { CreatePoolPayload } from "@/lib/solana/types";
import { useRouter } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  isValidSolanaPublicKey,
  isValidStellarAddress,
} from "@/utils/validator";
import { Token } from "@/lib/solana/model/Token";
import { useStellarStore } from "@/lib/store/stellar";

export default function CreatePool() {
  const route = useRouter();
  const { client } = useSolanaStore();
  const { client: stellarClient } = useStellarStore();
  const { query, sign, confirmation, loading } = useLoading();
  const [tokens, setToken] = useState<Token[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Partial<CreatePoolPayload>>({
    timestamp: new BN(0),
    amount: new BN(0),
    fee: new BN(0),
    splitFee: new BN(0),
    tokenAddress: "",
    authority: {
      signer: undefined,
      feeWallet: undefined,
    },
    isPublic: false,
  });

  const fetchTokens = useCallback(async () => {
    if (client) {
      try {
        const tokenList = await query(() => client.query.listTokens());
        setToken(tokenList);
      } catch (error) {
        console.error("Error listing pools:", error);
      }
    }
  }, [client, query]);

  useEffect(() => {
    fetchTokens();
  }, [client, fetchTokens]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = new BN(value);
    if (type === "checkbox")
      newValue = !formData[name as keyof CreatePoolPayload];
    if (name === "tokenAddress" && isValidStellarAddress(value))
      newValue = value;
    if (name === "mint" && isValidSolanaPublicKey(value))
      newValue = new PublicKey(value);
    if (name === "mintSelect") {
      newValue = tokens[Number(e.target.value)].mint;
      setFormData((prev) => ({
        ...prev,
        mint: newValue,
      }));
      return;
    }
    if (
      (name === "signer" || name === "feeWallet") &&
      isValidSolanaPublicKey(value)
    ) {
      setFormData((prev) => ({
        ...prev,
        authority: {
          ...prev.authority,
          [name]: new PublicKey(value),
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.mint || !isValidSolanaPublicKey(formData.mint.toString()))
      newErrors.signer = "Invalid public key";
    if (!formData.tokenAddress) newErrors.tokenAddress = "Invalid address";
    if (formData.amount.isZero())
      newErrors.amount = "Must be greater than zero";
    if (formData.splitFee.isZero())
      newErrors.amount = "Must be greater than zero";
    if (formData.fee.isZero()) newErrors.amount = "Must be greater than zero";
    if (
      !formData.authority?.signer ||
      !isValidSolanaPublicKey(formData.authority.signer.toString())
    )
      newErrors.signer = "Invalid public key";
    if (
      !formData.authority?.feeWallet ||
      !isValidSolanaPublicKey(formData.authority.feeWallet.toString())
    )
      newErrors.signer = "Invalid public key";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      console.log("Invalid payload");

      return;
    }
    if (!client) return;
    const tx = await sign(() =>
      client.instructions.createPool(formData as unknown as CreatePoolPayload)
    );
    if (!tx) return;
    await confirmation(tx, () => route.push("/admin/solana"));
  };

  const className = (isValid?: string) =>
    `border  rounded-md bg-gray-300 ${
      isValid && isValid.length ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col items-center">
      <h3>Solana</h3>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="flex flex gap-16 mt-16">
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex flex-col gap-2">
                <span>Mint</span>
                <input
                  id="mint"
                  name="mint"
                  value={formData.mint?.toString()}
                  className={className(errors.mint)}
                  onChange={handleChange}
                />
              </div>{" "}
              {tokens.length > 0 && (
                <select
                  className="absolute"
                  name="mintSelect"
                  onChange={handleChange}
                >
                  <option value="">Available tokens</option>
                  {tokens.map((t, i) => (
                    <option key={i} value={i}>
                      {t.symbol}
                    </option>
                  ))}
                </select>
              )}
              {errors.mint && (
                <p className="absolute text-sm text-red-600">{errors.mint}</p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <span>Amount</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className={className(errors.amount)}
                  onChange={handleChange}
                />
              </div>
              {errors.amount && (
                <p className="absolute text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Fee</span>
                <input
                  type="number"
                  id="fee"
                  name="fee"
                  className={className(errors.fee)}
                  onChange={handleChange}
                />
              </div>
              {errors.fee && (
                <p className="absolute text-sm text-red-600">{errors.fee}</p>
              )}
            </div>
            <div className="flex gap-2">
              <span>Is Public</span>
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                checked={formData.isPublic}
                defaultChecked={formData.isPublic}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8 w-min">
            <div>
              <div className="flex flex-col gap-2">
                <span>Split Fee</span>
                <input
                  type="number"
                  id="splitFee"
                  name="splitFee"
                  className={className(errors.splitFee)}
                  onChange={handleChange}
                />
              </div>
              {errors.splitFee && (
                <p className="absolute text-sm text-red-600">
                  {errors.splitFee}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Stellar Token Address</span>
                <input
                  type="text"
                  id="tokenAddress"
                  name="tokenAddress"
                  className={className(errors.tokenAddress)}
                  onChange={handleChange}
                />
              </div>
              {errors.tokenAddress && (
                <p className="absolute text-sm text-red-600">
                  {errors.tokenAddress}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Authority</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    id="signer"
                    name="signer"
                    placeholder="Signer"
                    className={className(errors.authority)}
                    onChange={handleChange}
                  />
                  {errors.authority && (
                    <p className="absolute text-sm text-red-600">
                      {errors.authority}
                    </p>
                  )}
                  <input
                    type="text"
                    id="feeWallet"
                    name="feeWallet"
                    placeholder="Fee Wallet"
                    className={className(errors.authority)}
                    onChange={handleChange}
                  />
                  {errors.authority && (
                    <p className="absolute text-sm text-red-600">
                      {errors.authority}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <input
          type="submit"
          className="py-2 px-24 bg-purple-600 text-white rounded-full"
          value="Create pool"
        />
      </form>
      {loading}
    </div>
  );
}
