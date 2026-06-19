import React from "react";

interface SomeComponentProps {
  className?: string;
}

export function SomeComponent({ className }: SomeComponentProps) {
  return <div className={className}></div>;
}
