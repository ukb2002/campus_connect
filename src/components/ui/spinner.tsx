
import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn("animate-spin rounded-full border-4 border-t-transparent", className)}
      {...props}
    />
  );
};
