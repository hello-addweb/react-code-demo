import Image from "next/image";
import React from "react";
import locationIcon from "@/app/assets/icons/map-icon.svg";
import Text from "@/components/elements/Text/Text";
import Box from "@/components/elements/Box/Box";

interface LocationGroupDataTypes {
  locationArray: string[];
}

const LocationGroup = ({ locationArray }: LocationGroupDataTypes) => {
  return (
    <Box className="grid grid-cols-3 gap-7 my-14">
      {locationArray?.map((item, index) => {
        return (
          <Box className="flex items-start justify-start space-x-2" key={index}>
            <Image
              src={locationIcon}
              alt="location-icon"
              width={18}
              height={20}
            />
            <Text className="text-smallText text-darkBlueText font-PoppinsBold font-bold">
              {item}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default LocationGroup;
