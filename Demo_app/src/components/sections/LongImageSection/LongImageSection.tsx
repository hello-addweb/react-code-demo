import React from "react";
import Box from "@/components/elements/Box/Box";
import Image from "next/image";

interface LongImageSectionDataTypes {
  imageSource: string;
}

const LongImageSection = ({ imageSource }: LongImageSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Image
        src={imageSource}
        alt="long-image"
        width={2000}
        height={10}
        className="w-full object-contain"
        style={{ width: "auto" }}
      />
    </Box>
  );
};

export default LongImageSection;
