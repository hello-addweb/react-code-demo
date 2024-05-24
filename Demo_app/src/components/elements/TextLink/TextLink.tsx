import React from "react";
import { ElementProps } from "./textlink";

const TextLink: React.FC<ElementProps> = ({
  elementType = "a",
  children,
  className,
  href,
  ...rest
}) => {
  const validTextElements: Array<keyof JSX.IntrinsicElements> = ["a", "strong"];
  const Element = validTextElements.includes(elementType) ? elementType : "a";

  return (
    <Element href={href} className={className} {...rest}>
      {children}
    </Element>
  );
};

export default TextLink;
