import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface CustomersDataTypes {
  imgSrc: string;
  title: string;
}

const CustomersSection = ({ imgSrc, title }: CustomersDataTypes) => {
  return (
    <Box
      elementType="section"
      className="w-full border-t-2 border-solid bg-lightBg"
    >
      <Box className="sm:container px-containerPadding py-16 flex flex-col items-center justify-center">
        <Text
          elementType="h3"
          className="text-center text-secondary text-3xl font-bold font-PoppinsBold mb-7"
        >
          {title}
        </Text>
        <Image
          src={imgSrc}
          alt="customers"
          width={1000}
          height={232}
          style={{ width: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default CustomersSection;
