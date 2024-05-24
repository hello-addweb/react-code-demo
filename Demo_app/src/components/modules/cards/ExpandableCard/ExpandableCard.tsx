import React from "react";
import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import Text from "@/components/elements/Text/Text";
import Button from "@/components/elements/Button/Button";
import downArrow from "@/app/assets/icons/down-arrow.svg";
import downArrowOrange from "@/app/assets/icons/more-info-orange.svg";
import { ExpandableCardProps } from "./expandable";
import { getThemeColor } from "@/utils/helpers";
import FloatingCard from "../../floating-card/FloatingCard";

const ExpandableCard = ({
  moreInfoData,
  isExpanded,
  onCardExpand,
  theme,
}: ExpandableCardProps) => {
  const themeColors = getThemeColor(theme || "");
  return (
    <Box
      elementType="div"
      className={`w-full min-h-[268px] shadow-lg rounded-2xl p-6 flex flex-col items-center justify-between h-fit relative`}
      style={{
        backgroundColor: `${themeColors?.bgColor}`,
        color: `${themeColors?.textColor}`,
      }}
    >
      <Image
        src={moreInfoData?.imgSrc}
        alt="image"
        width={53}
        height={53}
        className="w-[53px] h-[53px] object-contain"
        style={{ width: "auto" }}
      />
      <Text
        elementType="h2"
        className="text-2xl font-bold leading-[33px] font-PoppinsBold py-3 text-center"
        style={{ color: `${themeColors?.titleColor}` }}
      >
        {moreInfoData?.title}
      </Text>
      {isExpanded && (
        <FloatingCard
          isExpanded={isExpanded}
          moreInfoData={moreInfoData}
          onCardExpand={onCardExpand}
          theme={theme}
          themeColors={themeColors}
        />
      )}
      <Button
        className="py-3 px-0 min-w-0 bg-transparent font-light hover:bg-transparent md:text-sm text-lightText flex items-center justify-center space-x-2.5"
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
          className={`h-3 w-3 transform ${isExpanded ? "rotate-180" : ""}`}
          style={{ width: "auto" }}
        />
      </Button>
    </Box>
  );
};

export default ExpandableCard;
