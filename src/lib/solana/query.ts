import { AccountClient, Idl, Program } from "@coral-xyz/anchor";
import { Pool as PoolSolana } from "@/lib/solana/model/Pool";
import { PublicKey } from "@solana/web3.js";
import { Admin } from "@/lib/solana/model/Admin";
import { Token } from "@/lib/solana/model/Token";
import { Pool } from "@/models/Pool";
import { adaptPool } from "./adapters";

interface Accounts {
  pool: AccountClient;
  admin: AccountClient;
  programToken: AccountClient;
}

interface Responses<T> {
  account: T;
  publicKey: PublicKey;
}

export class Query {
  private static instance: Query;
  private accounts: Accounts;
  private program: Program<Idl>;

  constructor(program: Program<Idl>) {
    this.accounts = program.account as Accounts;
    this.program = program;
  }

  private adapt<T>(response: Responses<T>): T {
    return {
      ...response.account,
      publicKey: response.publicKey,
    };
  }

  async getAdmin(): Promise<Admin | null> {
    const [adminPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("ADMIN")],
      this.program.programId
    );

    try {
      const admin = await this.accounts.admin.fetch(adminPda);
      return admin;
    } catch (error) {
      console.log(error);
      console.error("Error fetching pool:", error);
      return null;
    }
  }

  async getPool(mint: PublicKey): Promise<Pool | null> {
    const [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), mint.toBuffer()],
      this.program.programId
    );

    try {
      const pool = await this.accounts.pool.fetch(poolPda);
      return pool;
    } catch (error) {
      console.error("Error fetching pool:", error);
      return null;
    }
  }

  async listPools(): Promise<Pool[]> {
    try {
      const pools = await this.accounts.pool.all();
      return pools.map((p) => adaptPool(this.adapt<PoolSolana>(p)));
    } catch (error) {
      console.error("Error listing pools:", error);
      return [];
    }
  }

  async listTokens(): Promise<any> {
    try {
      const tokens = await this.accounts.programToken.all();
      return tokens.map((p) => this.adapt<Token>(p));
    } catch (error) {
      console.error("Error listing tokens:", error);
      return [];
    }
  }

  async listPoolsByAuthority(authority?: PublicKey): Promise<Pool[]> {
    try {
      const pools = await this.accounts.pool.all();
      if (authority) {
        return pools
          .filter((pool) =>
            (pool.account as PoolSolana).authority.signer.equals(authority)
          )
          .map((p) => p.account);
      }
      return pools.map((p) => adaptPool(this.adapt<PoolSolana>(p)));
    } catch (error) {
      console.error("Error listing pools:", error);
      return [];
    }
  }

  getBalance = async (mint: PublicKey) => {
    try {
      const info =
        await this.program.provider.connection.getTokenAccountBalance(mint);
      return info.value.uiAmount;
    } catch (e) {
      return 0;
    }
  };

  static getQuery(program: Program<Idl>): Query {
    if (!Query.instance) {
      Query.instance = new Query(program);
    }

    return Query.instance;
  }
}
