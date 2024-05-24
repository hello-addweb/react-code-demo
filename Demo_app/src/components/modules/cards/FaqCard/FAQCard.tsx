import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React, { useState } from "react";
import plusIcon from "@/app/assets/icons/plus-icon.svg";
import minusIcon from "@/app/assets/icons/minus-icon.svg";
import Text from "@/components/elements/Text/Text";
import { openFAQCardHandler } from "@/utils/helpers";

interface FAQCardDataType {
  questionTitle: string;
  answers: string;
  id: string;
}

const FAQCard = ({ questionTitle, answers, id }: FAQCardDataType) => {
  const [isCardExpanded, setIsCardExpanded] = useState<any>([]);

  return (
    <Box className="p-7 drop-shadow-lg rounded-lg bg-lightBg h-fit" id={id}>
      <Box
        className="flex items-center space-x-5 cursor-pointer"
        onClick={() =>
          openFAQCardHandler(answers, id, isCardExpanded, setIsCardExpanded)
        }
      >
        <Image
          src={
            isCardExpanded.some((item: { id: string }) => item.id === id)
              ? minusIcon
              : plusIcon
          }
          alt="plus-icon"
          width={22}
          height={22}
        />
        <Text className="text-darkText text-base font-bold font-[sans-serif]">
          {questionTitle}
        </Text>
      </Box>
      {isCardExpanded.some((item: { id: string }) => item.id === id) && (
        <Text
          className="pl-10"
          dangerouslySetInnerHTML={{
            __html: isCardExpanded.find(
              (item: { id: string }) => item.id === id
            )?.htmlContent,
          }}
        />
      )}
    </Box>
  );
};

export default FAQCard;
