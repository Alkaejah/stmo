"use client";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const BackkOfficeTimeZoneWrapper = ({ children }: Props) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currTimeZone = localStorage.getItem("timeZone");
      if (!currTimeZone) {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        localStorage.setItem("timeZone", timeZone);
      }
    }
  }, []);
  return <>{children}</>;
};

export default BackkOfficeTimeZoneWrapper;
