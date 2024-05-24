import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React, { useState } from "react";
import chatSVG from "@/app/assets/icons/chat.svg";
import closeSVG from "@/app/assets/icons/close.svg";
import ChatBox from "./ChatBox";

const ChatButton = () => {
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  const handleClick = () => {
    setIsShowChatBox((prev) => !prev);
  };
  return (
    <React.Fragment>
      <ChatBox isOpen={isShowChatBox} />
      <Box
        onClick={handleClick}
        className="rounded-full cursor-pointer bg-primary w-[60px] h-[60px] flex items-center justify-center fixed right-[2%] bottom-[2%] z-50 transition duration-150 ease-in-out hover:scale-125"
      >
        <Image
          src={isShowChatBox ? closeSVG : chatSVG}
          alt="chat-icon"
          width={isShowChatBox ? 15 : 30}
          height={isShowChatBox ? 15 : 30}
          style={{ width: "auto" }}
        ></Image>
      </Box>
    </React.Fragment>
  );
};

export default ChatButton;
