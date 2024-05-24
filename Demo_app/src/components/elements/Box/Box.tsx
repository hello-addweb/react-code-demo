import React, { ReactNode } from 'react';

interface ElementProps {
  elementType?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  className?: string;
  [key: string]: any;
}

const Box: React.FC<ElementProps> = ({ elementType = "div", children, className, ...rest }) => {
  const Element = elementType;
  return (
    <Element className={className} {...rest}>
      {children}
    </Element>
  );
};

export default Box;
