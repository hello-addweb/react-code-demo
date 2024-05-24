import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import React from "react";

interface QuoteCardDataTypes {
  title: string;
  description: string;
  btnTitle: string;
  cardColor: string;
}

const QuoteCard = ({
  btnTitle,
  cardColor,
  description,
  title,
}: QuoteCardDataTypes) => {
  return (
    <Box
      className="p-3 flex flex-col items-center justify-center text-lightText"
      style={{ backgroundColor: cardColor }}
    >
      <Text className="text-center pb-2 text-lgText font-bold font-PoppinsBold">
        {title}
      </Text>
      <Box className="h-[3px] w-full bg-primary" />
      <Text className="text-center text-base pt-2 pb-5">{description}</Text>
      {btnTitle && <Button className="w-full">{btnTitle}</Button>}
    </Box>
  );
};

export default QuoteCard;
