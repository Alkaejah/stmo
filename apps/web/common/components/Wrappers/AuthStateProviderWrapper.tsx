"use client";
import React from "react";
import { T_Session } from "@repo/contract";
import { Spinner } from "../ui/Spinner";
import useGetSessionDriver from "@/common/hooks/Drivers/useGetSessionDriver";
import useDriverSessionStore from "@/common/store/useDriverSessionStore";

const AuthStateProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading } = useGetSessionDriver();
  const updateSession = useDriverSessionStore((state) => state.update);
  const removeSession = useDriverSessionStore((state) => state.remove);

  if (isLoading) {
    return <Spinner variant="primary" middle />;
  }

  if (data && !data.error && data.item && !isLoading) {
    updateSession(data?.item as T_Session);
  } else if (data?.error && !isLoading) {
    removeSession();
  }

  return <>{children}</>;
};

export default AuthStateProviderWrapper;
