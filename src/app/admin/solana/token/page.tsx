"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLoading } from "@/lib/hooks/useLoading";
import { useSolanaStore } from "@/lib/store/solana";
import { CreateTokenPayload, isCompleted } from "@/lib/solana/types";
import { useNotify } from "@/lib/hooks/useNotify";
import { useRouter } from "next/navigation";
import { BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { isValidSolanaPublicKey } from "@/utils/validator";

export default function CreateToken() {
  const route = useRouter();
  const notify = useNotify();
  const { client } = useSolanaStore();
  const { query, sign, confirmation, loading } = useLoading();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Partial<CreateTokenPayload>>({
    timestamp: new BN(0),
    name: "",
    uri: "",
    symbol: "",
    decimals: 0,
    totalSupply: new BN(0),
    revokeAuthority: true,
    mintSupply: true,
    authority: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "number") newValue = parseInt(value, 10);
    if (type === "checkbox")
      newValue = !formData[name as keyof CreateTokenPayload];
    if (name === "totalSupply" || name === "timestamp")
      newValue = new BN(value);
    if (name === "decimals") newValue = Number(value);
    if (name === "authority" && isValidSolanaPublicKey(value))
      newValue = new PublicKey(value);

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.symbol) newErrors.symbol = "Symbol is required";
    if ((formData.decimals ?? 0) < 0)
      newErrors.decimals = "Must be a positive number";
    if (formData.totalSupply.isZero())
      newErrors.totalSupply = "Must be greater than zero";
    if (
      !formData.authority ||
      !isValidSolanaPublicKey(formData.authority.toString())
    )
      newErrors.authority = "Invalid public key";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (!client) return;
    const tx = await sign(() =>
      client.instructions.createToken(formData as unknown as CreateTokenPayload)
    );
    if (!tx) return;
    await confirmation(tx, () => route.push("/admin/solana/pool"));
  };

  const className = (isValid?: string) =>
    `border  rounded-md bg-gray-300 ${
      isValid && isValid.length ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <div className="flex flex-col items-center">
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="flex flex gap-8 mt-16">
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex flex-col gap-2">
                <span>Name</span>
                <input
                  id="name"
                  name="name"
                  className={className(errors.name)}
                  onChange={handleChange}
                />
              </div>{" "}
              {errors.name && (
                <p className="absolute text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <span>Symbol</span>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  className={className(errors.symbol)}
                  onChange={handleChange}
                />
              </div>
              {errors.symbol && (
                <p className="absolute text-sm text-red-600">{errors.symbol}</p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Uri</span>
                <input
                  type="text"
                  id="uri"
                  name="uri"
                  className={className(errors.uri)}
                  onChange={handleChange}
                />
              </div>
              {errors.uri && (
                <p className="absolute text-sm text-red-600">{errors.uri}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex flex-col gap-2">
                <span>Total Supply</span>
                <input
                  type="number"
                  id="totalSupply"
                  name="totalSupply"
                  className={className(errors.totalSupply)}
                  onChange={handleChange}
                />
              </div>
              {errors.totalSupply && (
                <p className="absolute text-sm text-red-600">
                  {errors.totalSupply}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Decimals</span>
                <input
                  type="number"
                  id="decimals"
                  name="decimals"
                  className={className(errors.decimals)}
                  onChange={handleChange}
                />
              </div>
              {errors.decimals && (
                <p className="absolute text-sm text-red-600">
                  {errors.decimals}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <span>Authority</span>
                <input
                  type="text"
                  id="authority"
                  name="authority"
                  className={className(errors.authority)}
                  onChange={handleChange}
                />
              </div>
              {errors.authority && (
                <p className="absolute text-sm text-red-600">
                  {errors.authority}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <span>Revoke Authority</span>
            <input
              type="checkbox"
              checked={formData.revokeAuthority}
              defaultChecked={formData.revokeAuthority}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2">
            <span>Mint Supply</span>
            <input
              type="checkbox"
              checked={formData.mintSupply}
              defaultChecked={formData.mintSupply}
              onChange={handleChange}
            />
          </div>
        </div>
        <input
          type="submit"
          className="py-2 px-24 bg-purple-600 text-white rounded-full"
          value="Create token"
        />
      </form>
      {loading}
    </div>
  );
}
