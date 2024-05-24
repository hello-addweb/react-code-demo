import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import CardImage from "/src/app/assets/images/card1.png.webp";
import Text from "@/components/elements/Text/Text";
import { PriceCardType } from "./priceCard";
import Button from "@/components/elements/Button/Button";
import CardLists from "../../card-list/CardLists";
import Link from "next/link";
import BookingPrice from "../../booking-price/BookingPrice";

const InfoCard = ({ priceCardData, isButton, className }: PriceCardType) => {
  return (
    <Box className={`w-full rounded-lg h-full flex flex-col ${className}`}>
      <Image
        src={CardImage}
        alt="card"
        width={500}
        height={500}
        className="object-contain rounded-t-xl w-full h-auto p-5"
        style={{ width: "auto" }}
      />
      <Box elementType="div" className="p-5 space-y-5">
        <Text className="text-center text-tertiary text-2xl font-bold font-PoppinsBold">
          {priceCardData?.cardTitle}
        </Text>
        {Array.isArray(priceCardData?.cardDetailsList) ? (
          <CardLists lists={priceCardData?.cardDetailsList} />
        ) : (
          <Text
            elementType="p"
            className="text-center text-greyText line-clamp-4"
          >
            {priceCardData?.cardDetailsList}
          </Text>
        )}
      </Box>
      {isButton && priceCardData?.cardPriceTag ? (
        <Box className="mt-auto p-5">
          <Box className="flex items-center justify-center xs:justify-between flex-wrap xs:flex-nowrap space-y-2 xs:space-y-0">
            <BookingPrice pricePerHalfHour={priceCardData?.cardPriceTag} />
            <Button className="px-10">Book Today</Button>
          </Box>
        </Box>
      ) : (
        <Box className="mt-auto p-5">
          <Text className="text-center underline">
            <Link href={`#`}>Read More</Link>
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default InfoCard;
