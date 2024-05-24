import React from "react";
import RatingsSection from "@/components/sections/RatingsSection/RatingsSection";
import SwipableCardSection from "@/components/sections/SwipableCardSection/SwipableCardSection";
import VideoSection from "@/components/sections/VideosSection/VideoSection";
import TitleSection from "@/components/sections/TitleSection/TitleSection";
import FeaturesWithImage from "@/components/sections/FeaturesWithImagesSection/FeaturesWithImage";
import CustomersSection from "@/components/sections/CustomersSection/CustomersSection";
import AdvantagesSection from "@/components/sections/AdvantagesSection/AdvantagesSection";
import FAQSection from "@/components/sections/FAQSection/FAQSection";
import StickyImageSection from "@/components/sections/StickyImageSection/StickyImageSection";

interface MainSectionDataTypes {
  data: any;
}

const MainSection = ({ data }: MainSectionDataTypes) => {
  return (
    <React.Fragment>
      {data?.map((item: { key: string; content: any }, index: number) => {
        switch (item?.key) {

          case "ratingSection":
            return (
              <RatingsSection
                key={index}
                ratingSectionData={
                  item?.content?.["social-ratings-data"]?.ratingAndReviewsData
                }
                setOfButtons={
                  item?.content?.["social-ratings-data"]?.["buttons-set"]
                }
                sectionHeaderData={item?.content?.["section-header-data"]}
              />
            );

          case "sliderCardSection":
            return (
              <SwipableCardSection
                key={index}
                btnTitle={item?.content?.BtnTitle}
                imageData={item?.content?.["slider-card-image-data"]}
                sectionHeaderData={item?.content?.["section-header-data"]}
                dropdownData={item?.content?.["slider-card-dropdown-data"]}
              />
            );
          case "videoSection":
            return (
              <VideoSection
                key={index}
                redirectionUrl={item?.content?.redirectionUrl}
                sectionHeaderData={item?.content?.["section-header-data"]}
              />
            );

          case "stickyImageSection":
            return (
              <StickyImageSection
                key={index}
                title={item?.content?.title}
                heading={item?.content?.heading}
                imgSrc={item?.content?.["image-source"]}
                sectionHeaderData={item?.content?.["section-header-data"]}
                qualityList={item?.content?.["removalists-quality-list"]}
              />
            );

          case "titleSection":
            return <TitleSection key={index} title={item?.content?.title} />;

          case "featureImageSection":
            return (
              <FeaturesWithImage
                key={index}
                featuresWithImageSectionData={item?.content}
              />
            );

          case "customerSection":
            return (
              <CustomersSection
                key={index}
                imgSrc={item?.content?.img}
                title={item?.content?.title}
              />
            );

          case "advantageSection":
            return (
              <AdvantagesSection
                key={index}
                imageSource={item?.content?.img}
                title={item?.content?.title}
                subTitle={item?.content?.subTitle}
              />
            );

          case "faqSection":
            return (
              <FAQSection
                key={index}
                title={item?.content?.title}
                questionList={item?.content?.questionsList}
                questionAnswerSet={item?.content?.questionAnswerSet}
              />
            );
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
};

export default MainSection;
