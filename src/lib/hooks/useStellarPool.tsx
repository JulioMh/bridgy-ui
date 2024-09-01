import { Pool } from "@/models/Pool";
import { useCallback, useEffect, useState } from "react";
import { StellarUtils } from "../stellar/utils";
import { useNotify } from "./useNotify";
import { useStellarStore } from "../store/stellar";

export const useStellarPool = () => {
  const notify = useNotify();
  const { client } = useStellarStore();
  const [fetchingPools, setLoading] = useState(false);

  const [pools, setPools] = useState<Pool[]>([]);

  const fetchPools = useCallback(async () => {
    if (client) {
      try {
        setLoading(true);
        const getPools = await client.deployer.get_pools();
        const getPoolsVals = await client.utils.fetchContractValue(getPools);
        const poolInfos = StellarUtils.scValToPoolInfo(getPoolsVals);
        const pools = await Promise.all(
          poolInfos.map(async (poolInfo) => {
            const getPool = await client.pool(poolInfo.pool).get_pool();
            const poolVal = await client.utils.fetchContractValue(getPool);
            const pool = StellarUtils.scValToPool(poolVal);
            return { ...pool, contractId: poolInfo.pool };
          })
        );
        setPools(pools);
      } catch (error) {
        notify("error", `Error listing pools: ${error})`);
      } finally {
        setLoading(false);
      }
    }
  }, [client, notify]);

  useEffect(() => {
    fetchPools();
  }, [client, fetchPools]);

  return {
    pools,
    fetchingPools,
  };
};
