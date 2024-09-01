import { NextRequest } from "next/server";
import { Release, ReleaseLiqPayload } from "../../../../packages/pool/dist";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { amount, from, to } = body;

  // const events = getEvents();
  // if(!validate(events)) return 403;

  const release: ReleaseLiqPayload = {
    amount: amount,
    to: to,
    timestamp: BigInt(Date.now()),
    external_other_chain: to,
  };
};
