import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import React from "react";

interface BestMoversDataTypes {
  title: string;
  btnTitle: string;
  moversList: {
    key: string;
    values: string[];
  }[];
}

const BestMoversOptionsSection = ({
  title,
  btnTitle,
  moversList,
}: BestMoversDataTypes) => {
  return (
    <Box elementType="section" className="bg-darkPurple w-full">
      <Box className="sm:container px-containerPadding py-4">
        <Text className="text-center text-xlText font-bold font-PoppinsBold text-lightText mt-12 mb-7">
          {title}
        </Text>
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 text-center">
          {moversList?.map((item, index) => {
            return (
              <Box key={index}>
                <Text className="mt-7 mb-2.5 text-primary font-bold text-smallText font-PoppinsBold">
                  {item.key}
                </Text>
                {item?.values?.map((data, indexVal) => {
                  return (
                    <React.Fragment key={indexVal}>
                      <Text className="p-1 text-lightText text-smallText">
                        {data}
                      </Text>
                    </React.Fragment>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box className="w-full flex items-center justify-center my-8">
          <Button>{btnTitle}</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BestMoversOptionsSection;
