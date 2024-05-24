import React, { ReactNode } from "react";

interface ElementProps {
  elementType?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

const Text: React.FC<ElementProps> = ({
  elementType = "p",
  children,
  ...rest
}) => {
  const validTextElements: Array<keyof JSX.IntrinsicElements> = [
    "p",
    "span",
    "strong",
    "em",
    "i",
    "li",
    "b",
    "mark",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ];
  const Element = validTextElements.includes(elementType) ? elementType : "p";

  return <Element {...rest}>{children}</Element>;
};

export default Text;
