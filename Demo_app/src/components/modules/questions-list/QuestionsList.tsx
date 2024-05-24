import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import TextLink from "@/components/elements/TextLink/TextLink";
import { QuestionsListDataType } from "@/components/sections/FAQSection/faq";
import React from "react";

const QuestionsList = ({ questionList }: QuestionsListDataType) => {
  return (
    <Box className="px-4">
      <Box
        elementType="ul"
        className="flex flex-wrap items-center justify-center"
      >
        {questionList.map((item, index) => {
          return (
            <Text
              elementType="li"
              key={index}
              className="text-primary text-smallText underline pr-5 pl-2 py-2"
            >
              <TextLink href={`#${item?.id}`}>{item?.question}</TextLink>
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};

export default QuestionsList;
