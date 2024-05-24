import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import { ShadowImageDataType } from "./shadowImage";
import { setShadowDimension, setShadowPosition } from "@/utils/helpers";

const ShadowImage = ({
  imageURL,
  shadowPosition,
  shadowDimension,
}: ShadowImageDataType) => {
  const shadowPositionClass = setShadowPosition(shadowPosition);
  const shadowDimensionClass = setShadowDimension(shadowDimension);
  return (
    <Box className="w-full h-auto relative">
      <Image
        src={imageURL}
        alt="image-shadow"
        width={490}
        height={600}
        className={`rounded-xl z-20`}
        style={{ width: "auto" }}
      />
      <Box
        className={`absolute bg-secondary opacity-10 ${shadowPositionClass}`}
        style={{
          width: shadowDimensionClass?.width,
          height: shadowDimensionClass?.height,
        }}
      />
    </Box>
  );
};

export default ShadowImage;
