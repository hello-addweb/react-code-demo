import React from "react";
import Box from "@/components/elements/Box/Box";
import allDummyData from "@/app/data/dummyData.json";
import ImageAndTextComponent from "@/components/modules/features-and-image/ImageAndTextComponent";

interface FeaturesWithImageDataTypes {
  featuresWithImageSectionData: {
    componentsData: any[];
  }[];
}

const FeaturesWithImage = ({
  featuresWithImageSectionData,
}: FeaturesWithImageDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="sm:container m-auto px-8 py-14 space-y-24">
        {featuresWithImageSectionData?.map((item, index) => {
          return (
            <ImageAndTextComponent
              key={index}
              data={item?.componentsData}
              direction={
                item?.componentsData[0]?.name === "image" ? "left" : "right"
              }
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default FeaturesWithImage;
