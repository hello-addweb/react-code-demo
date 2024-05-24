import Button from "@/components/elements/Button/Button";
import React from "react";

interface ButtonsGroupDataTypes {
  btnLists: {
    btnTitle: string;
    btnColor: string;
    btnLocationList: string[];
  }[];
  setBtnData: any;
}

const ButtonsGroup = ({ btnLists, setBtnData }: ButtonsGroupDataTypes) => {
  return (
    <React.Fragment>
      {btnLists?.map((item, index) => {
        return (
          <Button
            className={`m-1 text-sm font-bold text-darkGrayText bg-lightGrayBackground hover:bg-secondary hover:text-lightText`}
            key={index}
            onClick={() => setBtnData(item?.btnLocationList)}
          >
            {item?.btnTitle}
          </Button>
        );
      })}
    </React.Fragment>
  );
};

export default ButtonsGroup;
