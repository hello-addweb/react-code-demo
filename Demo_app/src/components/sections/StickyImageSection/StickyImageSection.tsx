import React from "react";
import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import StickyImageComponent from "@/components/modules/sticky-image-component/StickyImageComponent";

interface TopRatedDataTypes {
  heading: string;
  title: string;
  imgSrc: string;
  sectionHeaderData: {
    header: string;
    description: string;
  };
  qualityList: {
    imgURL: string;
    title: string;
    description: string;
  }[];
}

const StickyImageSection = ({
  heading,
  imgSrc,
  qualityList,
  sectionHeaderData,
  title,
}: TopRatedDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-darkBg">
      <Box className="sm:container px-containerPadding py-16">
        <SectionHeader
          titleTextColor="text-tertiary"
          descriptionClass="lg:px-4"
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
        />
        <Text className="font-bold text-2xl text-lightText font-PoppinsBold pt-10 max-w-full md:max-w-[50%] w-full">
          {heading}
        </Text>
        <StickyImageComponent
          title={title}
          imageSource={imgSrc}
          qualityList={qualityList}
        />
      </Box>
    </Box>
  );
};

export default StickyImageSection;
