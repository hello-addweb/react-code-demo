import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Box from "../elements/Box/Box";
import MainSection from "@/pages/Main";

interface HomeLayoutTypes {
  data: any;
}

const HomeLayout = ({ data }: HomeLayoutTypes) => {
  return (
    <React.Fragment>
      <Header />
      <Box elementType="main">
        <MainSection data={data?.homePageData?.homePageData} />
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export default HomeLayout;
