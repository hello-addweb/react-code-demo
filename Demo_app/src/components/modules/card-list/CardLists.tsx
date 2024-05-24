import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import purpleCheck from "/src/app/assets/icons/tiny-purple-check.svg";
import Text from "@/components/elements/Text/Text";

interface ListType {
  lists: string[];
}

const CardLists = ({ lists }: ListType) => {
  return (
    <Box
      elementType="ul"
      className="flex flex-wrap items-center justify-center"
    >
      {lists.map((item, index) => {
        return (
          <Box
            key={index}
            elementType="div"
            className="flex items-center justify-center mx-1 mb-3 space-x-2 px-2"
          >
            <Image
              src={purpleCheck}
              alt="purple-check"
              width={17}
              height={17}
              style={{ width: "auto" }}
            />
            <Text elementType="li" className="text-greyText text-[15px] ">
              {item}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default CardLists;
