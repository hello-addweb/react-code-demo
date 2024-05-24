import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";
import downArrow from "@/app/assets/icons/down-arrow.svg";
import downArrowOrange from "@/app/assets/icons/more-info-orange.svg";
import { FloatingCardTypes } from "./floatingCard";

const FloatingCard = ({
  themeColors,
  moreInfoData,
  onCardExpand,
  isExpanded,
  theme,
}: FloatingCardTypes) => {
  return (
    <Box
      className={`absolute rounded-2xl top-[60%] w-full bg-inherit p-6 shadow-md shadow-blue-500/50 z-50 flex flex-col items-center justify-center`}
    >
      <Text
        elementType="p"
        className={`text-center text-smallText`}
        style={{ color: `${themeColors?.textColor}` }}
      >
        {moreInfoData.description}
      </Text>
      <Button
        className="pt-5 pb-2 px-0 min-w-0 bg-transparent font-light hover:bg-transparent md:text-sm text-lightText flex items-center justify-center space-x-2.5"
        onClick={onCardExpand}
      >
        <Text
          elementType="p"
          className={`text-sm font-[sans-serif]`}
          style={{ color: `${themeColors?.textColor}` }}
        >
          {isExpanded ? "Less info" : "More info"}
        </Text>
        <Image
          src={theme === "" || theme === "light" ? downArrowOrange : downArrow}
          alt="down-arrow"
          width={14}
          height={14}
          className={`h-3 w-3 transform transition ${
            isExpanded ? "rotate-180" : ""
          }`}
          style={{ width: "auto" }}
        />
      </Button>
    </Box>
  );
};

export default FloatingCard;
