import { keccak256, toBuffer, ecsign } from "ethereumjs-utils";
import { Release, serialize } from "@/lib/solana/model/Release";

export interface Coupon {
  signature: string;
  recoveryId: number;
}

export class Coupons {
  private static hash(values: any): string {
    return keccak256(Buffer.from(values));
  }

  private static sign(hash: string): Coupon {
    const sig = ecsign(
      toBuffer(hash),
      toBuffer(`0x${process.env.BE_PRIV_KEY}`)
    );

    return {
      signature: Buffer.concat([sig.r, sig.s]).toString("hex"),
      recoveryId: sig.v - 27,
    };
  }

  static build(payload: Uint8Array): Coupon {
    return this.sign(this.hash(payload));
  }

  static release(release: Release): Coupon {
    const serialized = serialize(release);
    return Coupons.build(serialized);
  }
}
