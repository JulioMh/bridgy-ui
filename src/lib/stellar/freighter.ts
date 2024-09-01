import freighterApi, {
  getPublicKey,
  isConnected,
} from "@stellar/freighter-api";

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
  sorobanRpcUrl?: string;
}

export type Connector = {
  id: string;
  name: string;
  shortName?: string;
  iconUrl: string | (() => Promise<string>);
  iconBackground: string;
  installed?: boolean;
  downloadUrls?: {
    android?: string;
    ios?: string;
    browserExtension?: string;
    qrCode?: string;
  };
  isConnected: () => Promise<boolean>;
  getNetworkDetails: () => Promise<NetworkDetails>;
  getPublicKey: () => Promise<string>;
  signTransaction: (
    xdr: string,
    opts?: {
      network?: string;
      networkPassphrase?: string;
      accountToSign?: string;
    }
  ) => Promise<string>;
};

export function freighter(): Connector {
  return {
    id: "freighter",
    name: "Freighter",
    iconUrl: "https://stellar.creit.tech/wallet-icons/freighter.svg",
    // iconUrl: async () => (await import('./freighter.svg')).default,
    iconBackground: "#fff",
    // TODO: Check this
    installed: true,
    downloadUrls: {
      browserExtension:
        "https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en",
    },
    isConnected() {
      return freighterApi?.isConnected();
    },
    getNetworkDetails(): Promise<NetworkDetails> {
      return freighterApi.getNetworkDetails();
    },
    getPublicKey(): Promise<string> {
      return freighterApi.getPublicKey();
    },
    signTransaction(
      xdr: string,
      opts?: {
        network?: string;
        networkPassphrase?: string;
        accountToSign?: string;
      }
    ): Promise<string> {
      return freighterApi.signTransaction(xdr, opts);
    },
  };
}
