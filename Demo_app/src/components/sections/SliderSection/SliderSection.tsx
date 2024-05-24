import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Pagination } from "swiper/modules";
import Box from "@/components/elements/Box/Box";
import SectionHeader from "@/components/modules/section-header/SectionHeader";
import InfoCard from "@/components/modules/cards/InfoCard/InfoCard";

interface SliderSectionDataTypes {
  sectionHeaderData: {
    header: string;
    description: string;
  };
  swiperData: {
    cardImage: string;
    cardTitle: string;
    cardDetailsList: string;
    cardPriceTag: string;
  }[];
}

const SliderSection = ({
  sectionHeaderData,
  swiperData,
}: SliderSectionDataTypes) => {
  return (
    <Box elementType="section" className="w-full bg-lightBg">
      <Box className="sm:container px-containerPadding py-16">
        <SectionHeader
          title={sectionHeaderData?.header}
          paragraphs={sectionHeaderData?.description}
        />
        <React.Fragment>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            // pagination={{
            //   clickable: true,
            // }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination]}
            className=""
          >
            {swiperData?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <SwiperSlide>
                    <InfoCard
                      priceCardData={item}
                      isButton={false}
                      className="border border-solid border-[#ccc]"
                    />
                  </SwiperSlide>
                </React.Fragment>
              );
            })}
          </Swiper>
        </React.Fragment>
      </Box>
    </Box>
  );
};

export default SliderSection;
