import React from "react";
import Box from "../elements/Box/Box";
import Button from "../elements/Button/Button";
import Text from "../elements/Text/Text";
import allDummyData from "../../app/data/dummyData.json";
import HamburgerMenu from "../modules/hamburger-menu/HamburgerMenu";
import Link from "next/link";
import NavbarLinks from "../modules/navbar/nav-links/NavbarLinks";
import Logo from "../elements/Logo/Logo";

const Header: React.FC = () => {
  return (
    <Box
      elementType="header"
      className="bg-darkBg"
      style={{ borderBottom: "2px solid #009bba" }}
    >
      <Box className="sm:container m-auto w-full flex items-center justify-between px-4 md:px-8 py-2">
        <Link href={`/`}>
          <Logo src={"https://via.placeholder.com/500"} height={70} width={145} />
        </Link>
        <NavbarLinks NavLinksSet={allDummyData?.["header-Data"]?.navLinks} />
        <Box className="flex flex-col items-center justify-center">
          <HamburgerMenu />
        </Box>
        <Button className="ms-[1em] hidden lg:block">
          {allDummyData?.["header-Data"]?.["button-Title"]}
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
