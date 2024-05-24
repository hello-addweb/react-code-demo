import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import hamburgerIcon from "@/app/assets/icons/hamburger.svg";

const HamburgerMenu = () => {
  return (
    <Box className="flex items-center justify-center md:justify-end w-full px-2 lg:hidden">
      <Image
        src={hamburgerIcon}
        alt="hamburger-menu-icon"
        width={30}
        height={35}
        style={{ width: "auto" }}
      />
    </Box>
  );
};

export default HamburgerMenu;
