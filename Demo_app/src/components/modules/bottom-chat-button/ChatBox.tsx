import Box from "@/components/elements/Box/Box";
import Image from "next/image";
import React from "react";
import editIcon from "@/app/assets/icons/editIcon.svg";
import Text from "@/components/elements/Text/Text";

interface ChatBoxDataTypes {
  isOpen: boolean;
}

const data = [
  {
    id: 1,
    value:
      "Don’t have time to wait for a response? Leave your email and we’ll be in touch as soon as possible.",
  },
  {
    id: 2,
    value:
      "Don’t have time to wait for a response? Leave your email and we’ll be in touch as soon as possible.",
  },
];

const ChatBox = ({ isOpen }: ChatBoxDataTypes) => {
  return (
    <Box
      className={`w-[400px] h-[530px] bg-lightBg rounded-md z-50 fixed bottom-[10%] shadow-lg ${
        isOpen
          ? "ease right-[2%] bg-white transition-all duration-300"
          : "ease right-[-1500%] bg-transparent transition-all duration-300"
      }`}
    >
      <Box className="px-4 py-5 bg-primary flex items-center justify-between rounded-t-md">
        <Text className="text-lg font-bold font-PoppinsBold text-lightText">
          Your Chats
        </Text>
        <Image
          src={editIcon}
          alt="edit-icon"
          width={24}
          height={24}
          className="cursor-pointer"
          style={{ width: "auto" }}
        />
      </Box>
      <Box className="w-full h-full">
        {data?.map((item, index) => {
          return (
            <Box
              key={index}
              className="py-2 px-4 border-b border-gray-100 flex items-center hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={"https://via.placeholder.com/500"}
                alt="zoom-logo"
                width={48}
                height={48}
                className="rounded-full"
                style={{ width: "auto" }}
              />
              <Box className="pl-3 w-full">
                <Box className="flex items-center justify-between text-xs text-[#425B76] font-[Arial]">
                  <Text>After hours emergency chat</Text>
                  <Text>3 min. ago</Text>
                </Box>
                <Text className="line-clamp-1 my-2 text-sm font-[Arial] text-[#33475b]">
                  {item?.value}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ChatBox;
