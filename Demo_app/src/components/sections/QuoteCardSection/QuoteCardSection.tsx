import Box from "@/components/elements/Box/Box";
import SectionDescription from "@/components/modules/section-description/SectionDescription";
import React from "react";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import QuoteCard from "@/components/modules/cards/QuoteCard/QuoteCard";

interface QuoteCardSectionDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  customersData: {
    title: string;
    img: string;
  };
  cardsData: {
    title: string;
    description: string;
    btnTitle: string;
    cardColor: string;
  }[];
}

const QuoteCardSection = ({
  sectionHeaderData,
  customersData,
  cardsData,
}: QuoteCardSectionDataTypes) => {
  return (
    <Box
      elementType="section"
      className="w-full bg-lightBg"
      data-section="QuoteCardSection"
    >
      <Box className="sm:container px-containerPadding py-16">
        <Box className="block md:flex items-start justify-between">
          <Box className="md:w-1/2 md:pr-8">
            <SectionDescription
              header={sectionHeaderData?.header}
              description={sectionHeaderData?.description}
              className="text-3xl text-[#000000] mb-8"
            />
          </Box>
          <Box className="md:w-1/2 md:pl-8">
            <Box className="flex flex-col items-center justify-center">
              <Text className="text-baseText text-secondary font-bold font-PoppinsBold mt-2 mb-6">
                {customersData?.title}
              </Text>
              <Image
                src={customersData?.img}
                alt="customers-list-image"
                width={600}
                height={138}
                className="mt-3 mb-6"
                style={{ width: "auto" }}
              />
            </Box>
            <Box className="flex flex-col gap-y-5 sm:grid sm:grid-rows-2 sm:grid-flow-col sm:gap-y-10">
              {cardsData?.map((item, index) => {
                return (
                  <QuoteCard
                    key={index}
                    btnTitle={item?.btnTitle}
                    cardColor={item?.cardColor}
                    description={item?.description}
                    title={item?.title}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuoteCardSection;
