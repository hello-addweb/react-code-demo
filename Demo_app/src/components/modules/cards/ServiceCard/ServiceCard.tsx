import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface ServiceCardTypes {
  cardData: {
    title: string;
    icon: string;
    description: string;
    btnTitle: string;
  };
}

const ServiceCard = ({ cardData }: ServiceCardTypes) => {
  return (
    <Box className="w-full h-full border border-[#ccc] rounded-3xl p-4 relative flex flex-col items-center justify-between">
      <Box className="absolute left-0 right-0 top-[-40px] m-auto w-20 h-20 border-t border-[#ccc] rounded-full z-50 flex items-center justify-center bg-white">
        <Image
          src={cardData?.icon}
          alt="icon"
          width={44}
          height={44}
          style={{ width: "auto" }}
        />
      </Box>
      <Box>
        <Text className="text-center mt-10 mb-6 text-darkText text-baseText font-bold font-PoppinsBold">
          {cardData?.title}
        </Text>
        <Box dangerouslySetInnerHTML={{ __html: cardData?.description }} />
      </Box>
      <Box className="flex items-center justify-center">
        <Button>{cardData?.btnTitle}</Button>
      </Box>
    </Box>
  );
};

export default ServiceCard;
