import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import { ImageRendererDataTypes } from "./shadowImage";

const ImageRenderer = ({ imgURL, alignImage }: ImageRendererDataTypes) => {
  return (
    <Box
      className={`w-full lg:w-1/2 relative flex items-center mb-10 md:mb-0 ${
        alignImage === "left"
          ? "justify-center md:justify-start"
          : "justify-center md:justify-end"
      }`}
    >
      <Image
        src={imgURL}
        alt={imgURL}
        width={490}
        height={587}
        className="rounded-xl"
        style={{ width: "auto" }}
      />
    </Box>
  );
};

export default ImageRenderer;
