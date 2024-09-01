"use client";

import Link from "next/link";

import PoolTable from "@/components/pools/PoolTable";
import { Loading } from "@/components/ux/Loading";
import { useStellarPool } from "@/lib/hooks/useStellarPool";

export default function Admin() {
  const { pools, fetchingPools } = useStellarPool();
  return (
    <div className="flex flex-col items-stretch mt-16 gap-8">
      <div className="flex flex-row justify-between ">
        <Link
          className="self-start btn-primary text-purple-600 border-2 p-2 rounded-md border-purple-600"
          href={"/admin/stellar/pool"}
        >
          New Pool
        </Link>
      </div>
      <PoolTable pools={pools} />
      {fetchingPools && <Loading text="Loading" />}
    </div>
  );
}
