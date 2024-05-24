import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import React from "react";

interface PriceType {
  pricePerHalfHour: string;
}

const BookingPrice = ({ pricePerHalfHour }: PriceType) => {
  return (
    <Box className="text-secondary">
      <Text
        elementType="p"
        className="text-xs font-bold font-PoppinsBold leading-[0.8rem]"
      >
        From
      </Text>
      <Text elementType="span" className="flex items-center">
        <Text
          elementType="strong"
          className="font-bold text-2xl font-PoppinsBold"
        >
          ${pricePerHalfHour}/
        </Text>
        <Text
          elementType="em"
          className="text-xs font-bold font-PoppinsBold leading-[0.9rem]"
        >
          per <br /> half hour{" "}
        </Text>
      </Text>
    </Box>
  );
};

export default BookingPrice;
