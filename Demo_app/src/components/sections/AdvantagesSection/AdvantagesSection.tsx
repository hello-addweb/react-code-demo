import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface AdvantagesSectionDataTypes {
  title: string;
  subTitle: string;
  imageSource: string;
}

const AdvantagesSection = ({
  imageSource,
  subTitle,
  title,
}: AdvantagesSectionDataTypes) => {
  return (
    <Box
      elementType="section"
      className="w-full bg-lightBg border-t-2 border-solid"
    >
      <Box className="sm:container px-containerPadding py-16">
        <Text
          elementType="h3"
          className="text-center text-secondary text-3xl font-bold font-PoppinsBold mb-7"
        >
          {title}
        </Text>
        <Image
          src={imageSource}
          alt="advantages"
          width={1230}
          height={235}
          className="my-5"
          style={{ width: "auto" }}
        />
        <Text className="text-center text-smallText text-greyText mt-4">
          {subTitle}
        </Text>
      </Box>
    </Box>
  );
};

export default AdvantagesSection;
