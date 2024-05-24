// pages/_document.tsx
import { Metadata } from "next";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

// export const metadata: Metadata = {
//   title: "Zoom Removalists",
//   description: "a website for package and goods movers",
//   keywords: [
//     "removalists",
//     "zoom removalists",
//     "sydney",
//     "local removalist",
//     "package removal",
//     "package mover",
//   ],
//   viewport: "device-width initial-scale=1",
// };

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        {/* <Head>
          <meta
            name="description"
            content="An online platform for finding and booking vacation rentals worldwide."
          />
          <meta
            name="keywords"
            content="vacation rentals, holiday homes, booking, travel, removalists"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head> */}
        <Head />
        <body className="custom-body-class">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
