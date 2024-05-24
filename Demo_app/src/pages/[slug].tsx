import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import MainSection from "./Main";
import React from "react";
import Box from "@/components/elements/Box/Box";

interface AllDummyData {
  [key: string]: any;
}

const allDummyData: AllDummyData = require("@/app/data/dummyData.json");

const ProductPage = ({ slug, data }: any) => {
  return (
    <React.Fragment>
      <Header />
      <Box elementType="main">
        <MainSection data={data?.[slug]?.[slug]} />
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { slug } = params;
  const data = allDummyData;
  return {
    props: {
      slug,
      data,
    },
  };
}

export default ProductPage;
