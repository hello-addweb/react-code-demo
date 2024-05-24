import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import React, { useState } from "react";
import FurnishedType from "../../furnishedType/FurnishedType";
import { SwipableCardTypes } from "./swipableCard";
import Select from "@/components/elements/Select/Select";

const SwipableCard = ({
  furnishedType,
  selectOptionsData,
}: SwipableCardTypes) => {
  const [sliderValue, setSliderValue] = useState<number>(1);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  return (
    <Box className="sm:p-4 py-3 max-w-[280px] w-full xs:max-w-[596px] flex flex-col items-center justify-center">
      <Box className="sm:flex items-center justify-between sm:justify-evenly space-x-1 sm:space-x-8 w-full">
        <Text className="font-bold font-PoppinsBold text-xl text-center pb-4 sm:pb-0">
          I'm Moving My
        </Text>

        <Select
          name="house-type"
          className="bg-inherit max-w-[282px]"
          options={selectOptionsData}
        />
      </Box>
      <Box className="py-10 flex items-center justify-between">
        {furnishedType?.map((item, index) => {
          return (
            <FurnishedType
              key={index}
              imgSrc={item?.imgSrc}
              title={item?.title}
            />
          );
        })}
      </Box>
      <input
        className="w-full max-w-[70%] mx-auto mb-5 sm:mb-10"
        aria-label="range"
        type="range"
        min="1"
        max="3"
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <Text className="shadow-lg px-10 py-5 text-primary text-smallText font-PoppinsBold font-bold rounded-lg">
        {`Approximately ${sliderValue + 1}-${sliderValue + 2} hours`}
      </Text>
    </Box>
  );
};

export default SwipableCard;
