import * as DeployerClient from "../../../packages/deployer/dist/index.js";
import { SorobanRpc } from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";
import { freighter, NetworkDetails } from "./freighter";
import { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Pool } from "@/models/Pool.js";
import { rpc } from "stellar-sdk";

export class StellarUtils {
  soroban: SorobanRpc.Server;
  networkDetails: NetworkDetails;

  constructor(networkDetails: NetworkDetails) {
    this.soroban = new SorobanRpc.Server(networkDetails.sorobanRpcUrl!, {
      allowHttp: true,
    });
    this.networkDetails = networkDetails;
  }

  async fetchContractValue<T>(
    txn: AssembledTransaction<T>
  ): Promise<StellarSdk.xdr.ScVal> {
    const { simulation }: AssembledTransaction<T> = await txn.simulate();
    if (!simulation) {
      throw new Error("Txn could not be simulated");
    }
    if (SorobanRpc.Api.isSimulationError(simulation)) {
      throw new Error(simulation.error);
    }
    if (!simulation.result) {
      throw new Error(`invalid simulation: no result in ${simulation}`);
    }

    return simulation.result.retval;
  }

  async submit_txn<T>(
    txn: AssembledTransaction<T>
  ): Promise<StellarSdk.xdr.ScVal | undefined> {
    const signature = await freighter().signTransaction(txn.built!.toXDR(), {
      networkPassphrase: this.networkDetails.networkPassphrase,
      network: this.networkDetails.network,
    });
    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signature,
      this.networkDetails.networkPassphrase
    );

    try {
      let sendResponse = await this.soroban.sendTransaction(
        transactionToSubmit
      );
      console.log(`Sent transaction`);

      if (sendResponse.status === "PENDING") {
        let getResponse = await this.soroban.getTransaction(sendResponse.hash);
        // Poll `getTransaction` until the status is not "NOT_FOUND"
        while (getResponse.status === "NOT_FOUND") {
          console.log("Waiting for transaction confirmation...");
          // See if the transaction is complete
          getResponse = await this.soroban.getTransaction(sendResponse.hash);
          // Wait one second
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (getResponse.status === "SUCCESS") {
          // Make sure the transaction's resultMetaXDR is not empty
          if (!getResponse.resultMetaXdr) {
            throw "Empty resultMetaXDR in getTransaction response";
          }
          // Find the return value from the contract and return it
          let transactionMeta = getResponse.resultMetaXdr;
          let returnValue = transactionMeta.v3().sorobanMeta()?.returnValue();
          console.log(`Transaction confirmed`);
          return returnValue;
        } else {
          throw `Transaction failed: ${getResponse.resultXdr}`;
        }
      } else {
        throw sendResponse.errorResult;
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      console.log("Sending transaction failed");
      console.log(JSON.stringify(err));
      throw err;
    }
  }

  static scValToAuthority(
    scVal: StellarSdk.xdr.ScVal
  ): DeployerClient.Authority {
    const [val1, val2] = scVal.value() as unknown as [
      StellarSdk.xdr.ScMapEntry,
      StellarSdk.xdr.ScMapEntry
    ];

    return {
      [StellarSdk.scValToNative(val1.key())]:
        StellarSdk.StrKey.encodeEd25519PublicKey(
          val1.val().address().accountId().value()
        ),
      [StellarSdk.scValToNative(val2.key())]:
        StellarSdk.StrKey.encodeEd25519PublicKey(
          val2.val().address().accountId().value()
        ),
    } as unknown as DeployerClient.Authority;
  }

  static scValToPoolInfo(
    scVal: StellarSdk.xdr.ScVal
  ): DeployerClient.PoolInfo[] {
    const poolVals = scVal.value() as any[];

    return poolVals.map((val) => {
      const vals = val.value() as [
        StellarSdk.xdr.ScMapEntry,
        StellarSdk.xdr.ScMapEntry,
        StellarSdk.xdr.ScMapEntry
      ];

      return vals.reduce((acc, entry) => {
        const key = StellarSdk.scValToNative(entry.key());

        return key === "token_symbol"
          ? {
              ...acc,
              token_symbol: StellarSdk.scValToNative(entry.val()),
            }
          : {
              ...acc,
              [key]: StellarSdk.StrKey.encodeContract(
                entry.val().address().contractId()
              ),
            };
      }, {});
    }) as unknown as DeployerClient.PoolInfo[];
  }

  static scValToPool(scVal: StellarSdk.xdr.ScVal): Pool {
    const entries = scVal.value() as StellarSdk.xdr.ScMapEntry[];

    return entries.reduce((acc, entry) => {
      const key = StellarSdk.scValToNative(entry.key());
      if (key === "owner") {
        const authority = this.scValToAuthority(entry.val());
        return {
          ...acc,
          authority: {
            signer: authority.signer,
            feeWallet: authority.fee_wallet,
          },
        };
      }
      if (key === "token")
        return {
          ...acc,
          token: StellarSdk.StrKey.encodeContract(
            entry.val().address().contractId()
          ),
        };

      return {
        ...acc,
        [key.replace(/(_\w)/g, (match: any) => match[1].toUpperCase())]:
          StellarSdk.scValToNative(entry.val()),
      };
      return acc;
    }, {}) as unknown as Pool;
  }
}
