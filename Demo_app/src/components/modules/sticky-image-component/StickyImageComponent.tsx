import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";
import allDummyData from "@/app/data/dummyData.json";
import RemovalistQualityLists from "../removalist-quality-list/RemovalistQualityLists";

interface StickyImageComponentDataTypes {
  imageSource: string;
  title: string;
  qualityList: {
    imgURL: string;
    title: string;
    description: string;
  }[];
}

const StickyImageComponent = ({
  title,
  qualityList,
  imageSource,
}: StickyImageComponentDataTypes) => {
  return (
    <Box className="block md:flex flex-wrap md:flex-nowrap">
      <Box className="w-full md:w-1/2 text-white px-0 md:px-4">
        <Text className="my-4 text-smallText font-[sans-serif]">{title}</Text>
        {qualityList && qualityList.map((item, index) => {
          return (
            <RemovalistQualityLists
              key={index}
              imgSrc={item?.imgURL}
              title={item?.title}
              description={item?.description}
            />
          );
        })}
      </Box>
      <Box className="w-full md:w-1/2 flex items-start justify-center md:justify-end">
        <Box className="md:sticky md:top-[8em]">
          <Image
            src={imageSource}
            alt={imageSource}
            width={550}
            height={700}
            className="rounded-xl"
            style={{ width: "auto" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StickyImageComponent;
