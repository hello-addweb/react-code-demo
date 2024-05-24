import HomeLayout from "@/components/layouts/HomeLayout";
import allDummyData from "@/app/data/dummyData.json";
import { Metadata } from "next";
import React from "react";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Test Removalists",
  description: "a website for package and goods movers",
  keywords: [
    "removalists",
    "test removalists",
    "sydney",
    "local removalist",
    "package removal",
    "package mover",
  ],
  viewport: "device-width initial-scale=1",
};

export async function getServerSideProps() {
  const data = allDummyData;

  return {
    props: {
      data,
    },
  };
}

export default function HomePage({ data }: any) {
  return (
    <React.Fragment>
      <Head>
        <meta
          name="description"
          content="An online platform for finding and booking vacation rentals worldwide."
        />
        <meta
          name="keywords"
          content="vacation rentals, holiday homes, booking, travel, removalists"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <HomeLayout data={data} />
    </React.Fragment>
  );
}
