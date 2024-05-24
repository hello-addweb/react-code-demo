import Link from "next/link";
import React, { ReactNode } from "react";

interface MenuItemProps {
  href?: string;
  title?: string;
  children?:ReactNode;
  [key: string]: any;
  linkProps?:{
        [key: string]: any;
  }
}

const ListItem: React.FC<MenuItemProps> = ({ href, title, linkProps,children, ...rest}) => {
  return (
    <li {...rest}>
      {(href && title) && <Link href={href} {...linkProps}>{title}</Link>}
      {children}
    </li>
  );
};

export default ListItem;
