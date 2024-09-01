import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  standalone: {
    networkPassphrase: "Standalone Network ; February 2017",
    contractId: "CCZIG72AI5O66IPY4QOZX2S2ZSMZAFESIIXEIK664EVNR6X2MRFYEK44",
  }
} as const


export interface CouponPayload {
  recovery_id: u32;
  signature: Buffer;
}

export type DataKey = {tag: "Pool", values: void} | {tag: "Admin", values: void} | {tag: "Be", values: void} | {tag: "Release", values: readonly [string]} | {tag: "Lock", values: readonly [string]};


export interface Pool {
  fee: u32;
  is_public: boolean;
  other_chain_address: string;
  owner: Authority;
  split_fees: u32;
  token: string;
  token_symbol: string;
}


export interface Release {
  last_claim: i128;
  total_claimed: i128;
}


export interface Lock {
  last_lock: i128;
  total_locked: i128;
}


export interface ReleaseLiqEvent {
  amount: i128;
  external_from: string;
  to: string;
  token: string;
  token_other_chain: string;
}


export interface Authority {
  fee_wallet: string;
  signer: string;
}


export interface ReleaseLiqPayload {
  amount: i128;
  external_other_chain: string;
  timestamp: i128;
  to: string;
}


export interface LockLiqEvent {
  amount: i128;
  from: string;
  to_other_chain: string;
  token_other_chain: string;
}

export const Errors = {
  1: {message:""},
  2: {message:""},
  3: {message:""},
  4: {message:""},
  5: {message:""}
}

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init: ({token, other_chain_address, fee, is_public, split_fees, owner, admin, be, token_symbol}: {token: string, other_chain_address: string, fee: u32, is_public: boolean, split_fees: u32, owner: Authority, admin: Authority, be: Buffer, token_symbol: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release_liq transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  release_liq: ({coupon_payload, payload}: {coupon_payload: CouponPayload, payload: ReleaseLiqPayload}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a lock_liq transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  lock_liq: ({user, amount, to_other_chain}: {user: string, amount: i128, to_other_chain: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: ({from, amount}: {from: string, amount: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Pool>>

  /**
   * Construct and simulate a get_release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_release: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Release>>

  /**
   * Construct and simulate a set_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_split: ({split_fees}: {split_fees: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({admin}: {admin: Authority}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_be transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_be: ({be}: {be: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Authority>>

  /**
   * Construct and simulate a set_visibility transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_visibility: ({is_public}: {is_public: boolean}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_owner: ({owner}: {owner: Authority}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_other_chain_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_other_chain_address: ({other_chain_address}: {other_chain_address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_fee: ({fee}: {fee: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_owner: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Authority>>

  /**
   * Construct and simulate a get_be transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_be: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAEaW5pdAAAAAkAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAATb3RoZXJfY2hhaW5fYWRkcmVzcwAAAAAQAAAAAAAAAANmZWUAAAAABAAAAAAAAAAJaXNfcHVibGljAAAAAAAAAQAAAAAAAAAKc3BsaXRfZmVlcwAAAAAABAAAAAAAAAAFb3duZXIAAAAAAAfQAAAACUF1dGhvcml0eQAAAAAAAAAAAAAFYWRtaW4AAAAAAAfQAAAACUF1dGhvcml0eQAAAAAAAAAAAAACYmUAAAAAA+4AAABBAAAAAAAAAAx0b2tlbl9zeW1ib2wAAAAQAAAAAA==",
        "AAAAAAAAAAAAAAALcmVsZWFzZV9saXEAAAAAAgAAAAAAAAAOY291cG9uX3BheWxvYWQAAAAAB9AAAAANQ291cG9uUGF5bG9hZAAAAAAAAAAAAAAHcGF5bG9hZAAAAAfQAAAAEVJlbGVhc2VMaXFQYXlsb2FkAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAIbG9ja19saXEAAAADAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAA50b19vdGhlcl9jaGFpbgAAAAAAEAAAAAA=",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAIZ2V0X3Bvb2wAAAAAAAAAAQAAB9AAAAAEUG9vbA==",
        "AAAAAAAAAAAAAAALZ2V0X3JlbGVhc2UAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAH0AAAAAdSZWxlYXNlAA==",
        "AAAAAAAAAAAAAAAJc2V0X3NwbGl0AAAAAAAAAQAAAAAAAAAKc3BsaXRfZmVlcwAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAfQAAAACUF1dGhvcml0eQAAAAAAAAA=",
        "AAAAAAAAAAAAAAAGc2V0X2JlAAAAAAABAAAAAAAAAAJiZQAAAAAD7gAAAEEAAAAA",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAfQAAAACUF1dGhvcml0eQAAAA==",
        "AAAAAAAAAAAAAAAOc2V0X3Zpc2liaWxpdHkAAAAAAAEAAAAAAAAACWlzX3B1YmxpYwAAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAJc2V0X293bmVyAAAAAAAAAQAAAAAAAAAFb3duZXIAAAAAAAfQAAAACUF1dGhvcml0eQAAAAAAAAA=",
        "AAAAAAAAAAAAAAAXc2V0X290aGVyX2NoYWluX2FkZHJlc3MAAAAAAQAAAAAAAAATb3RoZXJfY2hhaW5fYWRkcmVzcwAAAAAQAAAAAA==",
        "AAAAAAAAAAAAAAAHc2V0X2ZlZQAAAAABAAAAAAAAAANmZWUAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAJZ2V0X293bmVyAAAAAAAAAAAAAAEAAAfQAAAACUF1dGhvcml0eQAAAA==",
        "AAAAAAAAAAAAAAAGZ2V0X2JlAAAAAAAAAAAAAQAAA+4AAABB",
        "AAAAAQAAAAAAAAAAAAAADUNvdXBvblBheWxvYWQAAAAAAAACAAAAAAAAAAtyZWNvdmVyeV9pZAAAAAAEAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABFBvb2wAAAAAAAAAAAAAAAVBZG1pbgAAAAAAAAAAAAAAAAAAAkJlAAAAAAABAAAAAAAAAAdSZWxlYXNlAAAAAAEAAAATAAAAAQAAAAAAAAAETG9jawAAAAEAAAAT",
        "AAAAAQAAAAAAAAAAAAAABFBvb2wAAAAHAAAAAAAAAANmZWUAAAAABAAAAAAAAAAJaXNfcHVibGljAAAAAAAAAQAAAAAAAAATb3RoZXJfY2hhaW5fYWRkcmVzcwAAAAAQAAAAAAAAAAVvd25lcgAAAAAAB9AAAAAJQXV0aG9yaXR5AAAAAAAAAAAAAApzcGxpdF9mZWVzAAAAAAAEAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAADHRva2VuX3N5bWJvbAAAABA=",
        "AAAAAQAAAAAAAAAAAAAAB1JlbGVhc2UAAAAAAgAAAAAAAAAKbGFzdF9jbGFpbQAAAAAACwAAAAAAAAANdG90YWxfY2xhaW1lZAAAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAABExvY2sAAAACAAAAAAAAAAlsYXN0X2xvY2sAAAAAAAALAAAAAAAAAAx0b3RhbF9sb2NrZWQAAAAL",
        "AAAAAQAAAAAAAAAAAAAAD1JlbGVhc2VMaXFFdmVudAAAAAAFAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAADWV4dGVybmFsX2Zyb20AAAAAAAAQAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAABF0b2tlbl9vdGhlcl9jaGFpbgAAAAAAABA=",
        "AAAAAQAAAAAAAAAAAAAACUF1dGhvcml0eQAAAAAAAAIAAAAAAAAACmZlZV93YWxsZXQAAAAAABMAAAAAAAAABnNpZ25lcgAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAEVJlbGVhc2VMaXFQYXlsb2FkAAAAAAAABAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAABRleHRlcm5hbF9vdGhlcl9jaGFpbgAAABAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAsAAAAAAAAAAnRvAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAADExvY2tMaXFFdmVudAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAEZnJvbQAAABMAAAAAAAAADnRvX290aGVyX2NoYWluAAAAAAAQAAAAAAAAABF0b2tlbl9vdGhlcl9jaGFpbgAAAAAAABA=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAAMVW5hdXRob3JpemVkAAAAAQAAAAAAAAANSW52YWxpZENvdXBvbgAAAAAAAAIAAAAAAAAADVBvb2xJc1ByaXZhdGUAAAAAAAADAAAAAAAAAA1JbnZhbGlkUGFyYW1zAAAAAAAABAAAAAAAAAAPUG9vbEluaXRpYWxpemVkAAAAAAU=" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        release_liq: this.txFromJSON<null>,
        lock_liq: this.txFromJSON<null>,
        approve: this.txFromJSON<null>,
        get_pool: this.txFromJSON<Pool>,
        get_release: this.txFromJSON<Release>,
        set_split: this.txFromJSON<null>,
        set_admin: this.txFromJSON<null>,
        set_be: this.txFromJSON<null>,
        get_admin: this.txFromJSON<Authority>,
        set_visibility: this.txFromJSON<null>,
        set_owner: this.txFromJSON<null>,
        set_other_chain_address: this.txFromJSON<null>,
        set_fee: this.txFromJSON<null>,
        get_owner: this.txFromJSON<Authority>,
        get_be: this.txFromJSON<Buffer>
  }
}