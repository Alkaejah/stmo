import React from "react";
import QueryClientWrapper from "../QueryClientWrapper";
import TimeZoneWrapper from "./TimeZoneWrapper";
import AuthStateProviderWrapper from "./AuthStateProviderWrapper";

const wrappers = [
  // Add your wrappers here
  QueryClientWrapper,
  AuthStateProviderWrapper,
  TimeZoneWrapper,
];

// Wrapper component
const GlobalWrappers = ({ children }: { children: React.ReactNode }) => {
  // Recursively wrap the children with each wrapper
  return wrappers.reduceRight(
    (acc, WrapperComponent) => <WrapperComponent>{acc}</WrapperComponent>,
    children,
  );
};

export default GlobalWrappers;
