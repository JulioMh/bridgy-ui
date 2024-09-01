import { Pool } from "@/models/Pool";
import { shortify } from "@/utils/string";

interface PoolTableProps {
  pools: Pool[];
}

const PoolTable: React.FC<PoolTableProps> = ({ pools }) => {
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
              Fee
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Split Fees
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              External Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Authority Signer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Authority Fee Wallet
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Is Public
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pools.map((pool, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.tokenSymbol}{" "}
                <span className="text-sm">({shortify(pool.token)})</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.fee.toString()}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.splitFees.toString()}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shortify(pool.otherChainAddress)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shortify(pool.authority.signer)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shortify(pool.authority.feeWallet)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.isPublic ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoolTable;
