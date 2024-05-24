import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React, { useState } from "react";
import SectionDescription from "@/components/modules/section-description/SectionDescription";
import Button from "@/components/elements/Button/Button";
import ButtonsGroup from "@/components/modules/button-group/ButtonsGroup";
import LocationGroup from "@/components/modules/location-group/LocationGroup";

interface OurSuburbsDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  bottomHeader: string;
  buttonDataList: {
    btnTitle: string;
    btnColor: string;
    btnLocationList: string[];
  }[];
  btnTitle: string;
}

const OurSuburbsServices = ({
  sectionHeaderData,
  bottomHeader,
  btnTitle,
  buttonDataList,
}: OurSuburbsDataTypes) => {
  const [btnData, setBtnData] = useState<string[]>([]);
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="sm:container px-containerPadding py-16">
        <SectionHeader
          className="lg:px-4"
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
        />
        <Box className="pt-8 flex flex-wrap md:flex-nowrap">
          <Box className="w-full lg:w-1/2">
            <SectionDescription
              header={bottomHeader}
              className="text-3xl text-[#000000] mb-8"
            />
            <Box className="mt-8 mb-7">
              <ButtonsGroup btnLists={buttonDataList} setBtnData={setBtnData} />
            </Box>
            <Button className="max-w-[396px] w-full">{btnTitle}</Button>
          </Box>
          <Box className="w-full lg:w-1/2">
            <LocationGroup locationArray={btnData} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OurSuburbsServices;
