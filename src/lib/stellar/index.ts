import * as DeployerClient from "../../../packages/deployer/dist/index.js";
import * as PoolClient from "../../../packages/pool/dist/index.js";
import * as TokenClient from "../../../packages/soroban_token_contract/dist/index.js";
export * as DeployerClient from "../../../packages/deployer/dist/index.js";
export * as PoolClient from "../../../packages/pool/dist/index.js";
export * as TokenClient from "../../../packages/soroban_token_contract/dist/index.js";
import { NetworkDetails } from "./freighter";
import { StellarUtils } from "./utils";

export class StellarContract {
  deployer: DeployerClient.Client;
  utils: StellarUtils;
  publicKey: string;

  constructor({
    publicKey,
    networkDetails,
  }: {
    publicKey: string;
    networkDetails: NetworkDetails;
  }) {
    this.deployer = new DeployerClient.Client({
      contractId: DeployerClient.networks.standalone.contractId,
      networkPassphrase: networkDetails.networkPassphrase,
      rpcUrl: networkDetails.sorobanRpcUrl!,
      allowHttp: true,
      publicKey: publicKey,
    });
    this.publicKey = publicKey;
    this.utils = new StellarUtils(networkDetails);
  }

  pool(contractId: string): PoolClient.Client {
    return new PoolClient.Client({
      contractId,
      networkPassphrase: this.utils.networkDetails.networkPassphrase,
      rpcUrl: this.utils.networkDetails.sorobanRpcUrl!,
      allowHttp: true,
      publicKey: this.publicKey,
    });
  }

  token(contractId: string): TokenClient.Client {
    return new TokenClient.Client({
      contractId,
      networkPassphrase: this.utils.networkDetails.networkPassphrase,
      rpcUrl: this.utils.networkDetails.sorobanRpcUrl!,
      allowHttp: true,
      publicKey: this.publicKey,
    });
  }
}
