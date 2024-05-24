import React from "react";
import Image from "next/image";

interface LogoType {
  src: string | any;
  width: number;
  height: number;
}

const Logo = ({ src, width, height }: LogoType) => {
  return (
    <React.Fragment>
      <Image
        src={src}
        alt="logo"
        width={width}
        height={height}
        className="cursor-pointer w-[115px] h-[55px] md:w-[145px] md:h-[70px]"
        style={{ width: "auto" }}
      />
    </React.Fragment>
  );
};

export default Logo;
