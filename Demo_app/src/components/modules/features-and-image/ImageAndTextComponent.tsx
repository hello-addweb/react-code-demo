import Box from "@/components/elements/Box/Box";
import React from "react";
import SectionDescription from "../section-description/SectionDescription";
import ImageRenderer from "../shadow-image-component/ImageRenderer";

interface ImageAndTextComponentDataTypes {
  data: {
    name: string;
    data: any;
  }[];
  direction: string;
}

const ImageAndTextComponent = ({
  data,
  direction,
}: ImageAndTextComponentDataTypes) => {
  return (
    <Box
      className={`flex ${
        direction === "left" ? "flex-wrap" : "flex-wrap-reverse"
      } md:flex-nowrap items-center justify-between`}
    >
      {data?.map((component, index) => {
        switch (component?.name) {
          case "text":
            return (
              <Box className="w-full lg:w-1/2" key={index}>
                <SectionDescription
                  header={component?.data?.title}
                  description={component?.data?.description}
                  buttonData={component?.data?.buttonData}
                  className="text-3xl text-[#000000] mb-8"
                />
              </Box>
            );
          case "image":
            return (
              <ImageRenderer
                key={index}
                imgURL={component?.data?.imgSrc}
                alignImage={direction}
              />
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export default ImageAndTextComponent;
