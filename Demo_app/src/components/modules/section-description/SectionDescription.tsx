import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import React from "react";

interface SectionDescriptionTypes {
  header: string;
  description?: string;
  className?: string;
  buttonData?: {
    btnTitle: string;
    btnColor: string;
  }[];
}

const SectionDescription = ({
  header,
  description,
  buttonData,
  className,
}: SectionDescriptionTypes) => {
  return (
    <React.Fragment>
      <Text
        className={`font-bold font-PoppinsBold leading-10 lg:px-4 ${className}`}
      >
        {header}
      </Text>
      <Box
        className="lg:px-4"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <Box className="lg:mt-8 lg:px-4 xs:space-x-2 space-y-2 xs:space-y-0">
        {buttonData?.map((item, index) => {
          return (
            <Button key={index} style={{ backgroundColor: item?.btnColor }}>
              {item?.btnTitle}
            </Button>
          );
        })}
      </Box>
    </React.Fragment>
  );
};

export default SectionDescription;
