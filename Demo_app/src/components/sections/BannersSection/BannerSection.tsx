import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import BannerForm from "@/components/modules/forms/BannerForm";
import React from "react";

interface BannerSectionData {
  boldTitle: string;
  lightTitle: string;
  description: string;
  ratingAndReviewDescription: {
    imgSrc: string;
    description: string;
  };
  formData: {
    moveTypeOptions: {
      value: string;
      label: string;
    }[];
    moveSizeOptions: {
      value: string;
      label: string;
    }[];
    formHeaderTitle: string;
    btnTitle: string;
  };
}

const BannerSection = ({
  ratingAndReviewDescription,
  formData,
  boldTitle,
  description,
  lightTitle,
}: BannerSectionData) => {
  return (
    <Box
      elementType="section"
      className="bg-darkBg"
      data-section="BannerSection"
    >
      <Box className="sm:container m-auto flex">
        <Box className="max-w-[65%] px-8 py-10">
          <Box className="mb-1">
            <Text
              elementType="h1"
              className="text-3xl sm:text-[2.5em] font-PoppinsBold text-tertiary"
            >
              {boldTitle}
            </Text>
            <Text
              elementType="h2"
              className="text-lightText font-PoppinsBold text-3xl sm:text-[2.5em]"
            >
              {lightTitle}
            </Text>
          </Box>
          <Text className="text-lightText mb-[3.5em] my-[1em] text-[1em]">
            {description}
          </Text>
          <BannerForm className="pe-0 md:pe-[7rem]" formData={formData} />
        </Box>
        <Box className="w-[160px] h-[160px] bg-lightPrimary hover:bg-darkPurple my-10 rounded-full flex items-center justify-center cursor-pointer ease transition-all duration-300">
          <Text className="text-center text-white text-smallText font-bold font-[sans-serif]">
            Get Unlimited FREE Boxes
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BannerSection;
