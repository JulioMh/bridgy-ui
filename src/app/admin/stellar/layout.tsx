"use client";

import { useNotify } from "@/lib/hooks/useNotify";
import { useSolanaStore } from "@/lib/store/solana";
import { useStellarStore } from "@/lib/store/stellar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notify = useNotify();
  const { isAdmin } = useStellarStore();
  const route = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      notify("warning", "Admin required");
      route.push("/");
    }
  }, [isAdmin]);

  return <div>{children}</div>;
}
