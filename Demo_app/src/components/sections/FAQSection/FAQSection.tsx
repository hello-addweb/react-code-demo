import Box from "@/components/elements/Box/Box";
import QuestionsList from "@/components/modules/questions-list/QuestionsList";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import React from "react";
import { QuestionsListDataType } from "./faq";
import allDummyData from "@/app/data/dummyData.json";
import FAQCard from "@/components/modules/cards/FaqCard/FAQCard";

const FAQSection = ({
  questionList,
  title,
  questionAnswerSet = [],
}: QuestionsListDataType) => {
  return (
    <Box
      elementType="section"
      className="w-full bg-grayBg border-t-2 border-solid"
    >
      <Box className="sm:container px-containerPadding py-16">
        <SectionHeader title={title} className="mb-7" />
        <QuestionsList questionList={questionList} />
        <Box className="my-12">
          <Box
            elementType="ul"
            className="grid grid-cols-1 sm:grid-cols-2 gap-10"
          >
            {questionAnswerSet.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <FAQCard
                    questionTitle={item?.question}
                    answers={item?.answer}
                    id={item?.id}
                  />
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FAQSection;
