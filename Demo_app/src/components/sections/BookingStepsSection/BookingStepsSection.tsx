import Box from "@/components/elements/Box/Box";
import React from "react";
import ImageAndTextComponent from "@/components/modules/features-and-image/ImageAndTextComponent";
import Text from "@/components/elements/Text/Text";

interface BookingStepsSectionDataTypes {
  bookingStepsData: any[];
  sectionTitle?: string;
  className?: string;
}

const BookingStepsSection = ({
  bookingStepsData,
  className,
  sectionTitle,
}: BookingStepsSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-grayBg">
      <Box className="sm:container px-containerPadding py-16">
        {sectionTitle && (
          <Text
            elementType="h2"
            className={`text-center mb-10 text-largeText font-bold font-PoppinsBold ${className}`}
          >
            {sectionTitle}
          </Text>
        )}
        {bookingStepsData.map((item, index) => {
          return (
            <ImageAndTextComponent
              key={index}
              data={item?.componentsData}
              direction={
                item?.componentsData[0]?.name === "image" ? "left" : "right"
              }
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default BookingStepsSection;
