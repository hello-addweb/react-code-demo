import React from "react";
import Box from "@/components/elements/Box/Box";
import RatingAndReview from "@/components/modules/ratings-and-reviews/RatingAndReview";
import ButtonWithImage from "@/components/modules/btn-with-image/ButtonWithImage";
import SectionDescription from "@/components/modules/section-description/SectionDescription";

interface RatingSectionDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  ratingSectionData: any[];
  setOfButtons: any[];
}

const RatingsSection = ({
  sectionHeaderData,
  ratingSectionData,
  setOfButtons,
}: RatingSectionDataTypes) => {
  return (
    <Box
      elementType="section"
      className="w-full bg-lightBg"
      data-section="RatingsSection"
    >
      <Box
        elementType="section"
        className="sm:container px-8 py-14 flex flex-wrap-reverse lg:flex-nowrap items-start justify-between"
      >
        <Box className="max-w-full w-full xl:w-auto xl:max-w-[596px]">
          <SectionDescription
            header={sectionHeaderData?.header}
            description={sectionHeaderData?.description}
            className="text-3xl text-[#000000] mb-8"
          />
        </Box>
        <Box className="max-w-full w-full xl:w-auto xl:max-w-1/2 flex flex-col gap-5">
          <Box className="xs:grid xs:grid-cols-2 mt-4 max-w-[26em] w-full m-auto gap-y-10 mb-12 flex flex-col items-center justify-center">
            {ratingSectionData.map((item, index) => {
              return (
                <RatingAndReview
                  key={index}
                  imageSource={item?.img}
                  out_of={item?.["out-of"]}
                  rating={item?.rating}
                  reviews={item?.reviews}
                />
              );
            })}
          </Box>
          {setOfButtons.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <ButtonWithImage
                  BtnStyling={item?.btnStyling}
                  BtnTitle={item?.btnTitle}
                  imgSource={item?.iconSrc}
                />
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default RatingsSection;
