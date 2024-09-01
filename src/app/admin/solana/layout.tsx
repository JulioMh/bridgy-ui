"use client";

import { useNotify } from "@/lib/hooks/useNotify";
import { useSolanaStore } from "@/lib/store/solana";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notify = useNotify();
  const { isAdmin } = useSolanaStore();
  const route = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      notify("warning", "Admin required");
      route.push("/");
    }
  }, [isAdmin, notify, route]);

  return <div>{children}</div>;
}
