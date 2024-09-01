"use client";

import { Session } from "@/lib/session";
import { useSessionStore } from "@/lib/store/session";
import { useEffect } from "react";

export const SessionProvider = ({
  session,
  children,
}: {
  session: Session | null;
  children?: React.ReactNode;
}) => {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return children;
};
