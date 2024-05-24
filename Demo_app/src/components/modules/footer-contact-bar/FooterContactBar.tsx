import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Input/Input";
import Text from "@/components/elements/Text/Text";
import React from "react";

const FooterContactBar = () => {
  return (
    <Box elementType="nav" className="w-full bg-secondary py-4">
      <Box className="lg:container px-containerPadding flex flex-row items-center justify-center lg:space-x-7 relative">
        <Text
          elementType="h3"
          className="text-biggerText text-lightText font-bold font-PoppinsBold hidden lg:block"
        >
          In A Hurry? We Got You, Just Leave Your Number
        </Text>
        <Box className="flex items-center w-full lg:w-auto">
          <Input
            type="text"
            className="mb-0 bg-lightBg py-4"
            name="speed-quote-phone"
            placeholder="Phone number"
          />
          <Button className="absolute top-0 right-10 py-[14.5px]">
            Call me back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterContactBar;
