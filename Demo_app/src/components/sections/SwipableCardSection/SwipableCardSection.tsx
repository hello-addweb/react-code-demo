import React from "react";
import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import Button from "@/components/elements/Button/Button";
import SwipableCard from "@/components/modules/cards/SwipableCard/SwipableCard";

interface SliderDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  btnTitle: string;
  imageData: {
    imgSrc: string;
    title: string;
  }[];
  dropdownData: {
    value: string;
    label: string;
  }[];
}

const SwipableCardSection = ({
  btnTitle,
  dropdownData,
  imageData,
  sectionHeaderData,
}: SliderDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-grayBg">
      <Box
        elementType="section"
        className="m-auto sm:container px-8 py-14 flex flex-wrap lg:flex-nowrap items-start justify-center lg:justify-between space-y-5 lg:space-y-0"
      >
        <Box className="lg:max-w-[40%] max-w-full px-4 w-full flex flex-col items-center justify-center">
          <SectionHeader
            title={sectionHeaderData?.header}
            paragraphs={sectionHeaderData?.description}
          />
          <Button className="font-bold font-PoppinsBold">{btnTitle}</Button>
        </Box>
        <Box className="px-4 bg-white shadow-lg rounded-md">
          <SwipableCard
            furnishedType={imageData}
            selectOptionsData={dropdownData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SwipableCardSection;
