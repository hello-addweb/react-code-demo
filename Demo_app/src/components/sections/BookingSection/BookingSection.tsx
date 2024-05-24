import Box from "@/components/elements/Box/Box";
import InfoCard from "@/components/modules/cards/InfoCard/InfoCard";
import React from "react";
import allDummyData from "../../../app/data/dummyData.json";
import SectionHeader from "@/components/modules/section-header/SectionHeader";

interface BookingSectionDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  infoCardData: {
    cardImage: string;
    cardTitle: string;
    cardDetailsList: string[];
    cardPriceTag: string;
  }[];
}

const BookingSection = ({
  sectionHeaderData,
  infoCardData,
}: BookingSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box elementType="section" className="m-auto sm:container p-8 space-y-12">
        <SectionHeader
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
        />

        <Box
          elementType="div"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {infoCardData?.map((item, index) => {
            return (
              <InfoCard
                priceCardData={item}
                isButton={true}
                key={index}
                className="shadow-lg"
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default BookingSection;
