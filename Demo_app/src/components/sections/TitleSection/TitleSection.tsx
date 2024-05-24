import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React from "react";

interface TitleSectionDataTypes {
  title: string;
}

const TitleSection = ({ title }: TitleSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="sm:container px-containerPadding py-16">
        <SectionHeader title={title} />
        <Box className="my-6"></Box>
      </Box>
    </Box>
  );
};

export default TitleSection;
