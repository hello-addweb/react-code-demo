import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import SectionDescription from "@/components/modules/section-description/SectionDescription";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React from "react";

interface TradingGuidelinesDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  }[];
  guidelines: {
    title: string;
    description: string;
  }[];
  readMore: string;
}

const TradingGuidelinesSection = ({
  sectionHeaderData,
  guidelines,
  readMore,
}: TradingGuidelinesDataTypes) => {
  return (
    <Box elementType="section" className="bg-darkBg w-full">
      <Box className="sm:container px-containerPadding py-4">
        <React.Fragment>
          {sectionHeaderData?.map((item, index) => {
            return (
              <Box key={index}>
                <Text className="text-center text-xlText font-bold font-PoppinsBold text-lightText mt-16 mb-8">
                  {item?.header}
                </Text>
                <SectionHeader
                  paragraphs={item?.description}
                  descriptionClass="mx-12"
                />
              </Box>
            );
          })}
        </React.Fragment>
        <Box className="flex flex-wrap py-8 space-y-10 md:space-y-0">
          {guidelines?.map((item, index) => {
            return (
              <Box key={index} className="md:px-8 w-full md:w-1/2 text-center">
                <SectionDescription
                  header={item?.title}
                  description={item?.description}
                  className="text-lgText text-primary mb-6"
                />
              </Box>
            );
          })}
        </Box>
        <Text dangerouslySetInnerHTML={{ __html: readMore }} />
      </Box>
    </Box>
  );
};

export default TradingGuidelinesSection;
