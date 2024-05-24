import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1296px",
      // '2xl': '1536px',
    },
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "video-background":
          "url('https://via.placeholder.com/100')",
        "service-promise":
          "url('https://via.placeholder.com/100')",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        cardShadowBackground: "#8043be",
        lightGrayBackground: "#eee",
        darkPurple: "#4A2063",
        lightPrimary: "#ed8833",
      },
      lineHeight: {
        normalHeight: "59px",
      },
      colors: {
        primary: "#f58220",
        secondary: "#8043be",
        tertiary: "#009bba",

        lightText: "#fff",
        greyText: "#777",
        darkText: "#172242",
        darkGrayText: "#959595",
        darkBlueText: "#0b2244",

        lightBg: "#fff",
        darkBg: "#0d2244",
        grayBg: "#f5f4f4",

        grayBorder: "#ccc",
      },
      fontFamily: {
        sansSerif: ["sans-serif"],
        PoppinsRegular: ["PoppinsRegular", "sans-serif"],
        PoppinsMedium: ["PoppinsMedium", "sans-serif"],
        PoppinsSemiBold: ["PoppinsSemiBold", "sans-serif"],
        PoppinsBold: ["PoppinsBold", "sans-serif"],
      },
      fontSize: {
        smallText: ["17.6px", "26.4px"],
        baseText: ["24.64px", "33.264px"],
        lgText: ["22.88px", "30.888px"],
        mediumText: ["26.4px", "35.64px"],
        biggerText: ["28.72px", "37.422px"],
        xlText: ["30.8px", "41.58px"],
        largeText: ["44px", "59.4px"],
      },
      padding: {
        containerPadding: "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
