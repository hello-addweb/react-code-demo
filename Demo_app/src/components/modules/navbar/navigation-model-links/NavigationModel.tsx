"use client";
import React, { useEffect, useState } from "react";
import { NavigationModelType } from "./navigation-model";
import NavigationModelHeadings from "./NavigationModelHeadings";
import NavigationModelSubLinks from "./NavigationModelSubLinks";
import Box from "@/components/elements/Box/Box";

const NavigationModel = ({
  modelData,
  onMouseEnter,
  onMouseLeave,
}: NavigationModelType) => {
  const [subLinkData, setSubLinkData] = useState<any[]>([]);

  useEffect(() => {
    setSubLinkData(modelData[0]?.innerValues || []);
  }, [modelData]);

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      elementType="div"
      className="absolute container bg-lightBg left-0 right-0 border-t-8 border-primary p-5 min-h-[370px]"
    >
      <Box elementType="div" className="flex">
        <NavigationModelHeadings
          modelData={modelData}
          setSubLinkData={setSubLinkData}
        />
        <NavigationModelSubLinks subLinkData={subLinkData} />
      </Box>
    </Box>
  );
};

export default NavigationModel;
