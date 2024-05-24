import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React from "react";
import ExpandableCardRenderer from "@/components/modules/expandable-card-renderer/ExpandableCardRenderer";
import Text from "@/components/elements/Text/Text";
import Button from "@/components/elements/Button/Button";

interface ServicesListSectionTypes {
  cardDataSet: {
    cardId: string;
    imgSrc: string;
    title: string;
    description: string;
  }[];
  cardTheme?: string;
  sectionHeaderTitle?: string;
  sectionHeaderDescription?: string;
  sectionMiddleTitle?: string;
  buttonTitle?: string;
}

const ServicesListSection = ({
  cardTheme,
  buttonTitle,
  cardDataSet,
  sectionHeaderTitle,
  sectionMiddleTitle,
  sectionHeaderDescription,
}: ServicesListSectionTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box
        elementType="section"
        className="m-auto sm:container p-8 space-y-12 flex flex-col items-center"
      >
        <SectionHeader
          title={sectionHeaderTitle}
          paragraphs={sectionHeaderDescription}
        />
        {sectionMiddleTitle && (
          <Text
            elementType="h3"
            className="text-center text-2xl font-bold font-PoppinsBold"
          >
            {sectionMiddleTitle}
          </Text>
        )}
        <ExpandableCardRenderer cardDataSet={cardDataSet} theme={cardTheme} />
        {buttonTitle && <Button>{buttonTitle}</Button>}
      </Box>
    </Box>
  );
};

export default ServicesListSection;
