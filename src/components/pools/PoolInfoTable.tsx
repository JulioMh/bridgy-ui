"use client";
import { Pool } from "@/models/Pool";
import { shortify } from "@/utils/string";
import { PoolInfo } from "../../../packages/deployer/dist";

interface PoolInfoTableProps {
  pools: PoolInfo[];
}

const PoolInfoTable: React.FC<PoolInfoTableProps> = ({ pools }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Token
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pool Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pools.map((pool, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.token_symbol}{" "}
                <span className="text-sm">
                  ({shortify(pool.token_address)})
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shortify(pool.pool)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoolInfoTable;
