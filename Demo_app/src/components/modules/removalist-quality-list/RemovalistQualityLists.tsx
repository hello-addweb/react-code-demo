import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface RemovalistQualityListsDataTypes {
  imgSrc: string;
  title: string;
  description: string;
}

const RemovalistQualityLists = ({
  title,
  description,
  imgSrc,
}: RemovalistQualityListsDataTypes) => {
  return (
    <Box className="flex items-start justify-center my-10">
      <Box className="w-[58px] h-[58px] backdrop-blur-sm bg-white/10 rounded-full flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={imgSrc}
          width={30}
          height={30}
          style={{ width: "auto" }}
        />
      </Box>
      <Box className="w-[85%] ml-5">
        <Text className="text-mediumText font-bold font-PoppinsBold pb-4">
          {title}
        </Text>
        <Text className="my-4 text-smallText">{description}</Text>
      </Box>
    </Box>
  );
};

export default RemovalistQualityLists;
