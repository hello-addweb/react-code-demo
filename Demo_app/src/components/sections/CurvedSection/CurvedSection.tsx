import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";

interface CurvedSectionDataTypes {
  imageSrc: string;
}

const CurvedSection = ({ imageSrc }: CurvedSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="w-full h-[900px]">
        <Image
          src={imageSrc}
          alt="bg-image"
          width={2286}
          height={500}
          className="h-full object-cover"
          style={{ borderRadius: "50% / 10%" }}
        />
      </Box>
    </Box>
  );
};

export default CurvedSection;
