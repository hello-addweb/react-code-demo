"use client";
import React, { useState } from "react";
import { NavLinksType } from "./navLinks";
import Links from "../../../elements/Link/Link";
import Box from "@/components/elements/Box/Box";
import { handleLinkMouseEnter } from "@/utils/helpers";

interface ModelDataType {
  innerLink: string;
  innerValues: any[];
}

const NavbarLinks = ({ NavLinksSet }: NavLinksType) => {
  const [showHoverModel, setShowHoverModel] = useState(false);
  const [modelData, setModelData] = useState<ModelDataType[]>([]);

  return (
    <Box elementType="nav" className="ps-2">
      <Box
        elementType="div"
        className="hidden items-center justify-between px-2 lg:flex"
      >
        {NavLinksSet.map((item, index) => {
          return (
            <Box
              elementType="div"
              key={index}
              onMouseEnter={() =>
                handleLinkMouseEnter(
                  item?.values,
                  setModelData,
                  setShowHoverModel
                )
              }
              onMouseLeave={() => setShowHoverModel(false)}
            >
              <Links
                LinkStyle={`text-sm lg:text-base text-white hover:bg-primary px-1 h-[6.3em] flex items-center justify-center ${
                  modelData === item?.values && showHoverModel
                    ? "bg-primary"
                    : "bg-transparent"
                }`}
                LinkTitle={item?.title}
                ImageStyle={
                  modelData === item?.values && showHoverModel
                    ? "transform rotate-180 transition m-0 duration-500"
                    : "transition m-0 duration-500"
                }
                redirectTo={item?.redirect}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default NavbarLinks;
