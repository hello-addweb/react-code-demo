import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Image from "next/image";
import React from "react";

interface ButtonWithImageTypes {
  imgSource: string | any;
  BtnTitle: string;
  BtnStyling: string;
}

const ButtonWithImage = ({
  imgSource,
  BtnStyling,
  BtnTitle,
}: ButtonWithImageTypes) => {
  return (
    <Button className={BtnStyling}>
      <Image src={imgSource} alt="button logo" width={35} height={35} />
      <Text elementType="span" className="text-2xl font-bold font-PoppinsBold mx-2">
        {BtnTitle}
      </Text>
    </Button>
  );
};

export default ButtonWithImage;
