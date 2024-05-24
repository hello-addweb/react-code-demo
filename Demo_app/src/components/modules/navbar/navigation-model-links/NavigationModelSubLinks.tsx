import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import React from "react";

interface SubLinksType {
  subLinkData: any[];
}

const NavigationModelSubLinks = ({ subLinkData }: SubLinksType) => {
  return (
    <Box elementType="div" className="px-16 w-full space-y-5">
      {subLinkData.map((item, index) => {
        return (
          <Box elementType="div" key={index}>
            <Box
              elementType="div"
              className="pb-[0.5em] border-b-2 border-[#eee] mb-3"
            >
              <Text
                elementType="h1"
                className="text-xl font-bold text-secondary"
              >
                {item?.topic}
              </Text>
            </Box>
            <Box elementType="div" className="grid grid-cols-3">
              {item?.subLinks?.map((value: string, valueIndex: number) => {
                return (
                  <Text
                    key={valueIndex}
                    elementType="p"
                    className="py-1 text-darkText text-sm font-bold hover:text-tertiary cursor-pointer"
                  >
                    {value}
                  </Text>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default NavigationModelSubLinks;
