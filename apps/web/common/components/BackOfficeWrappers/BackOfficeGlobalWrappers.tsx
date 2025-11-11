import React from "react";
import BackOfficeAuthStateProviderWrapper from "./BackOfficeAuthStateProviderWrapper";
import BackOfficeTimeZoneWrapper from "./BackOfficeTimeZoneWrapper";
import BackOfficeQueryClientWrapper from "./BackOfficeQueryClientWrapper";

const wrappers = [
  // Add your wrappers here
  BackOfficeQueryClientWrapper,
  BackOfficeAuthStateProviderWrapper,
  BackOfficeTimeZoneWrapper,
];

// Wrapper component
const BackOfficeGlobalWrappers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Recursively wrap the children with each wrapper
  return wrappers.reduceRight(
    (acc, WrapperComponent) => <WrapperComponent>{acc}</WrapperComponent>,
    children,
  );
};

export default BackOfficeGlobalWrappers;
