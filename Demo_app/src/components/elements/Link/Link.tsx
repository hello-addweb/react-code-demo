import React from "react";
import Link from "next/link";
import Text from "../Text/Text";
import Image from "next/image";
import downArrow from "@/app/assets/icons/down-arrow.svg";

export interface LinkType {
  LinkTitle: string;
  LinkStyle: string;
  ImageStyle: string;
  redirectTo?: string;
}

const Links = ({
  LinkTitle,
  LinkStyle,
  ImageStyle,
  redirectTo = `#`,
}: LinkType) => {
  return (
    <Link href={redirectTo} className={LinkStyle}>
      <Text elementType="h1">{LinkTitle}</Text>
      {LinkTitle !== "Storage" && (
        <Image
          src={downArrow}
          alt="down-arrow"
          width={20}
          height={20}
          className={ImageStyle}
          style={{ width: "auto" }}
        />
      )}
    </Link>
  );
};

export default Links;
