"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLoading } from "@/lib/hooks/useLoading";
import { useSolanaStore } from "@/lib/store/solana";

import { Pool } from "@/models/Pool";
import PoolTable from "@/components/pools/PoolTable";

export default function Admin() {
  const { client } = useSolanaStore();
  const { query, loading } = useLoading();

  const [pools, setPools] = useState<Pool[]>([]);

  const fetchPools = useCallback(async () => {
    if (client) {
      try {
        const poolsList = await query(() => client.query.listPools());
        setPools(poolsList);
      } catch (error) {
        console.error("Error listing pools:", error);
      }
    }
  }, [client, query]);

  useEffect(() => {
    fetchPools();
  }, [client, fetchPools]);

  return (
    <div className="flex flex-col items-stretch mt-16 gap-8">
      <div className="flex flex-row justify-between ">
        <Link
          className="self-start btn-primary text-purple-600 border-2 p-2 rounded-md border-purple-600"
          href={"/admin/solana/token"}
        >
          New Token
        </Link>
        <Link
          className="self-start btn-primary text-purple-600 border-2 p-2 rounded-md border-purple-600"
          href={"/admin/solana/pool"}
        >
          New Pool
        </Link>
      </div>
      <PoolTable pools={pools} />
      {loading}
    </div>
  );
}
