import { ReactNode } from "react";

export interface ElementProps {
  elementType?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
  href: string;
  [key: string]: any;
}
