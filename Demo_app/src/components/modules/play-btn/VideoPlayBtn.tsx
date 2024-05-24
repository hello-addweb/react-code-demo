import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React, { useState } from "react";
import { PlayBtnTypes } from "./playBtn";

const VideoPlayBtn = ({ playBtnUrl }: PlayBtnTypes) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      className="w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box className="w-[120px] h-[120px] relative">
        <Box
          className={`w-full h-full rounded-full opacity-30 absolute top-0 right-0 left-0 bottom-0 m-auto transition-all duration-500 ${
            isHovered ? "bg-tertiary" : "bg-primary"
          }`}
        />
        <Box
          className={`w-[96px] h-[96px] rounded-full opacity-40 absolute top-0 right-0 left-0 bottom-0 m-auto transition-all duration-500 ${
            isHovered ? "bg-tertiary" : "bg-primary"
          }`}
        />
        <Box
          className={`w-[66px] h-[66px] rounded-full absolute top-0 right-0 left-0 bottom-0 m-auto flex items-center justify-center transition-all duration-500 ${
            isHovered ? "bg-tertiary" : "bg-primary"
          }`}
        >
          <Image
            src={playBtnUrl}
            alt="video-play-btn"
            width={28}
            height={28}
            style={{ width: "auto" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayBtn;
