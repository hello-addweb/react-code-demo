import React from "react";
import { NavigationData } from "./navigation-model";
import Text from "@/components/elements/Text/Text";
import Box from "@/components/elements/Box/Box";

interface HeadingsType {
  modelData: NavigationData[];
  setSubLinkData: any;
}

const NavigationModelHeadings = ({
  modelData,
  setSubLinkData,
}: HeadingsType) => {
  return (
    <Box elementType="div" className="w-[20%]">
      {modelData.map((item, index) => {
        return (
          <Box
            key={index}
            elementType="div"
            className="py-[1em] border-b border-secondary text-secondary hover:text-tertiary cursor-pointer"
            onMouseEnter={() => setSubLinkData(item?.innerValues)}
          >
            <Text elementType="h3" className="text-base font-bold">
              {item?.innerLink}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default NavigationModelHeadings;
