import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import allDummyData from "@/app/data/dummyData.json";
import React from "react";
import VideoPlayBtn from "@/components/modules/play-btn/VideoPlayBtn";
import videoPlayIcon from "@/app/assets/icons/videoPlayBtn.svg";

interface VideoSectionTypes {
  redirectionUrl: string;
  sectionHeaderData: {
    header: string;
    description: string;
  };
}

const VideoSection = ({
  redirectionUrl,
  sectionHeaderData,
}: VideoSectionTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box elementType="section" className="m-auto sm:container px-8 py-14">
        <SectionHeader
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
        />
        <a href={redirectionUrl} target="_blank">
          <Box className="w-auto mt-10 h-[550px] bg-video-background flex items-center justify-center bg-no-repeat bg-cover bg-center">
            <VideoPlayBtn playBtnUrl={videoPlayIcon} />
          </Box>
        </a>
      </Box>
    </Box>
  );
};

export default VideoSection;
