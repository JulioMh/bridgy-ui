"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { BN } from "@coral-xyz/anchor";
import {
  isValidSolanaPublicKey,
  isValidStellarAddress,
} from "@/utils/validator";
import { CreatePoolPayload } from "@/lib/stellar/payloads";
import { useStellarStore } from "@/lib/store/stellar";
import { Token } from "@/models/Token";
import { useSolanaStore } from "@/lib/store/solana";
import { Loading } from "@/components/ux/Loading";

export default function CreatePool() {
  const route = useRouter();
  const { client, pubKey } = useStellarStore();
  const { client: solanaClient } = useSolanaStore();
  const [loading, setLoading] = useState(false);
  const [tokens, setToken] = useState<Token[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Partial<CreatePoolPayload>>({
    fee: 0,
    split_fees: 0,
    token: "",
    token_symbol: "",
    owner: {
      signer: undefined,
      fee_wallet: undefined,
    },
    other_chain_address: "",
    deployer: pubKey,
    is_public: false,
  });

  const fetchTokens = useCallback(async () => {
    if (solanaClient) {
      try {
        const tokenList = await solanaClient.query.listTokens();
        setToken(tokenList);
      } catch (error) {
        console.error("Error listing pools:", error);
      }
    }
  }, [solanaClient]);

  useEffect(() => {
    fetchTokens();
  }, [solanaClient, fetchTokens]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = Number(value);
    if (type === "checkbox")
      newValue = !formData[name as keyof CreatePoolPayload];
    if (name === "token") newValue = value;
    if (name === "other_chain_address_select") {
      setFormData((prev) => ({
        ...prev,
        other_chain_address: tokens[Number(e.target.value)].mint.toString(),
      }));
      return;
    }
    if (
      (name === "signer" || name === "fee_wallet") &&
      isValidStellarAddress(value)
    ) {
      setFormData((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const validate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.token) {
      newErrors.signer = "Invalid token";
    }
    if (
      !formData.other_chain_address ||
      !isValidSolanaPublicKey(formData.other_chain_address)
    )
      newErrors.other_chain_address = "Invalid issuer";
    if (!formData.split_fees || formData.split_fees <= 0)
      newErrors.split_fees = "Must be greater than zero";
    if (!formData.fee || formData.fee <= 0)
      newErrors.fee = "Must be greater than zero";
    if (
      !formData.owner?.signer ||
      !isValidStellarAddress(formData.owner.signer)
    )
      newErrors.signer = "Invalid address";
    if (
      !formData.owner?.fee_wallet ||
      !isValidStellarAddress(formData.owner.fee_wallet)
    )
      newErrors.signer = "Invalid address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    if (!client) return;
    setLoading(true);

    const txn = await client.deployer.deploy(formData as any, {
      simulate: true,
    });

    await client.utils.submit_txn<readonly [string, any]>(txn);
    setLoading(false);
    route.push("/admin/stellar");
  };

  const className = (isValid?: string) =>
    `border  rounded-md bg-gray-300 ${
      isValid && isValid.length ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col items-center">
      <h3>Stellar</h3>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="flex flex gap-16 mt-16">
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex flex-col gap-2">
                <span>Ticker</span>
                <input
                  id="token_symbol"
                  name="token_symbol"
                  value={formData.token_symbol?.toString()}
                  className={className(errors.token_symbol)}
                  onChange={handleChange}
                />
              </div>
              {errors.token_symbol && (
                <p className="absolute text-sm text-red-600">
                  {errors.token_symbol}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Issuer</span>
                <input
                  id="token"
                  name="token"
                  value={formData.token?.toString()}
                  className={className(errors.token)}
                  onChange={handleChange}
                />
              </div>
              {errors.token && (
                <p className="absolute text-sm text-red-600">{errors.token}</p>
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
                name="is_public"
                id="is_public"
                checked={formData.is_public}
                defaultChecked={formData.is_public}
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
                  id="split_fees"
                  name="split_fees"
                  className={className(errors.split_fees)}
                  onChange={handleChange}
                />
              </div>
              {errors.split_fees}
              <p className="absolute text-sm text-red-600">
                {errors.split_fees}{" "}
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Solana Token Address</span>
                <input
                  type="text"
                  id="other_chain_address"
                  name="other_chain_address"
                  value={formData.other_chain_address?.toString()}
                  className={className(errors.other_chain_address)}
                  onChange={handleChange}
                />
              </div>
              {tokens.length > 0 && (
                <select
                  className="absolute"
                  name="other_chain_address_select"
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
              {errors.other_chain_address && (
                <p className="absolute text-sm text-red-600">
                  {errors.other_chain_address}
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
                    className={className(errors.owner)}
                    onChange={handleChange}
                  />
                  {errors.owner && (
                    <p className="absolute text-sm text-red-600">
                      {errors.owner}
                    </p>
                  )}
                  <input
                    type="text"
                    id="fee_wallet"
                    name="fee_wallet"
                    placeholder="Fee Wallet"
                    className={className(errors.owner)}
                    onChange={handleChange}
                  />
                  {errors.owner && (
                    <p className="absolute text-sm text-red-600">
                      {errors.owner}
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
      {loading && <Loading text="Waiting" />}
    </div>
  );
}
