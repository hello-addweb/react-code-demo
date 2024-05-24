import Box from "@/components/elements/Box/Box";
import ServiceCard from "@/components/modules/cards/ServiceCard/ServiceCard";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React from "react";

interface InterstateDataType {
  sectionHeaderData: {
    header: string;
    description: string;
    imgSrc?: string;
  };
  cardsData: {
    icon: string;
    title: string;
    description: string;
    btnTitle: string;
  }[];
}

const InterstateServicesSection = ({
  sectionHeaderData,
  cardsData,
}: InterstateDataType) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="sm:container px-4 py-16">
        <SectionHeader
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
          className="max-w-full"
          descriptionClass="px-4"
          img={sectionHeaderData?.imgSrc}
        />
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 mt-10">
          {cardsData?.map((item, index) => {
            return <ServiceCard key={index} cardData={item} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default InterstateServicesSection;
