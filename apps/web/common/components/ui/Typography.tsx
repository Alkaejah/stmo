import * as React from "react";
import { cn } from "@/common/helpers/cn";
import { VariantProps, cva } from "class-variance-authority";
const typographyVariants = cva("", {
  variants: {
    variant: {
      p: "text-base",
      h1: "text-3xl font-semibold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      h5: "text-sm font-semibold",
      h6: "text-xs font-semibold",
    },
    fontWeight: {
      normal: "font-normal",
      bold: "font-bold",
      thin: "font-thin",
      light: "font-light",
      extralight: "font-extralight",
      semiBold: "font-semibold",
    },
  },
  defaultVariants: {
    variant: "p",
    fontWeight: "normal",
  },
});
export interface TypographyProps
  extends React.DetailsHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ variant, fontWeight, className, children }, ref) => {
    const Comp = variant ?? "p";
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, fontWeight, className }))}
      >
        {children}
      </Comp>
    );
  },
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
