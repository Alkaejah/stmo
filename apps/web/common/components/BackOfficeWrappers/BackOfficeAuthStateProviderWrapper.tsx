"use client";
import React from "react";
import { T_Back_Office_Session } from "@repo/contract";
import { Spinner } from "../ui/Spinner";
import useGetBackOfficerSession from "@/common/hooks/BackOffice/useGetBackOfficerSession";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";

const BackOfficeAuthStateProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading } = useGetBackOfficerSession();
  const updateSession = useBackOfficeSessionStore((state) => state.update);
  const removeSession = useBackOfficeSessionStore((state) => state.remove);

  if (isLoading) {
    return <Spinner variant="primary" middle />;
  }

  if (data && !data.error && data.item && !isLoading) {
    updateSession(data?.item as T_Back_Office_Session);
  } else if (data?.error && !isLoading) {
    removeSession();
  }

  return <>{children}</>;
};

export default BackOfficeAuthStateProviderWrapper;
