import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import { getNewClassName } from "@/utils/helpers";
import Image from "next/image";
import React from "react";

interface SectionHeaderType {
  title?: string;
  paragraphs?: string;
  titleTextColor?: string;
  className?: string;
  descriptionClass?: string;
  img?: string;
}

const SectionHeader = ({
  title,
  paragraphs,
  titleTextColor,
  className,
  descriptionClass = "",
  img = "",
}: SectionHeaderType) => {
  const titleClassName = `text-center text-2xl xs:text-4xl sm:leading-normalHeight sm:text-[44px] text-secondary font-bold font-PoppinsBold ${titleTextColor}`;

  return (
    <Box
      elementType="div"
      className={`flex flex-col items-center justify-center max-w-[968px] w-full m-auto ${className}`}
    >
      <Text elementType="h2" className={titleClassName}>
        {title}
      </Text>
      {img && img !== "" && (
        <Image
          src={img}
          alt="section-image"
          width={150}
          height={120}
          className="my-8"
          style={{ width: "auto" }}
        />
      )}
      <Box
        className={descriptionClass}
        dangerouslySetInnerHTML={{ __html: paragraphs }}
      />
    </Box>
  );
};

export default SectionHeader;
