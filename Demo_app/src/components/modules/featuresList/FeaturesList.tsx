import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface FeaturesListType {
  img: string;
  title: string;
}

const FeaturesList = ({ img, title }: FeaturesListType) => {
  return (
    <Box
      elementType="div"
      className="flex flex-col items-center justify-center space-y-2"
    >
      <Image
        src={img}
        alt="img"
        width={100}
        height={105}
        className="h-24"
        style={{ width: "auto" }}
      />
      <Text
        elementType="h3"
        className="text-center mx-0 lg:mx-14 text-greyText font-[sans-serif] text-[17.6px] leading-2xl"
      >
        {title}
      </Text>
    </Box>
  );
};

export default FeaturesList;
