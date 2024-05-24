import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface FurnishedInterfaceType {
  title: string;
  imgSrc: string;
}

const FurnishedType = ({ imgSrc, title }: FurnishedInterfaceType) => {
  return (
    <Box className="flex flex-col items-center justify-between">
      <Image
        src={imgSrc}
        alt="furnished"
        width={110}
        height={85}
        className="w-[60px] h-12 sm:w-[110px] h-[85px]"
        style={{ width: "auto" }}
      />
      <Text className="font-bold font-PoppinsBold text-base sm:text-xl text-center py-7 mx-0 sm:mx-5">
        {title}
      </Text>
    </Box>
  );
};

export default FurnishedType;
