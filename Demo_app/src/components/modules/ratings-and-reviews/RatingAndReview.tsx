import Box from "@/components/elements/Box/Box";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface RatingAndReviewTypes {
  imageSource: string;
  rating: string;
  out_of: string;
  reviews: string;
}

const RatingAndReview = ({
  imageSource,
  out_of,
  rating,
  reviews,
}: RatingAndReviewTypes) => {
  return (
    <Box
      elementType="div"
      className="flex items-center justify-center space-x-5 sm:space-x-10"
    >
      <Image
        src={imageSource}
        alt={imageSource}
        width={42}
        height={42}
        style={{ width: "auto" }}
      />
      <Box className="flex flex-col items-center justify-center">
        <Text
          elementType="strong"
          className="text-2xl font-bold font-PoppinsBold leading-3"
        >
          {rating}{" "}
          <Text elementType="em" className="text-[11px] font-bold">
            /{out_of}
          </Text>{" "}
        </Text>
        <Text
          elementType="span"
          className="text-[11px] font-medium font-PoppinsBold"
        >
          {reviews} reviews
        </Text>
      </Box>
    </Box>
  );
};

export default RatingAndReview;
