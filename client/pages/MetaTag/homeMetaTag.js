import Head from "next/head";
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    videos: [
      {
        url: 'https://nextjs.org/video.mp4', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    audio: [
      {
        url: 'https://nextjs.org/audio.mp3', // Must be an absolute URL
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
const HomeMetaTag = () => {
  return (
    <Head>
      <title>Buy Men’s Shirts Online | Affordable Luxurious Fashion - HEED</title>
      <link rel="canonical" href="https://shopheed.com/" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Discover HEED's premium-quality men's shirts, crafted for style and comfort. From everyday casuals to formal dress shirts, shop the best cotton shirts online. Affordable luxury at its finest!"
      />
      <meta
        name="keywords"
        content="Buy Men's Shirts, Premium Cotton Shirts, Best Fashion Shirts, Luxury Men's Clothing, Affordable Shirts, Formal Shirts, Casual Shirts, Party Wear, Trendy Men's Wear"
      />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content="Buy Men’s Shirts Online | Affordable Luxurious Fashion - HEED" />
      <meta property="og:description" content="Discover HEED's premium-quality men's shirts, crafted for style and comfort. From everyday casuals to formal dress shirts, shop the best cotton shirts online. Affordable luxury at its finest!" />
      <meta property="og:image" content="https://shopheed.com/assets/images/icon/logo.png" />
      <meta property="og:url" content="https://shopheed.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Shop Heed" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Buy Men’s Shirts Online | Affordable Luxurious Fashion - HEED" />
      <meta name="twitter:description" content="Discover HEED's premium-quality men's shirts, crafted for style and comfort. From everyday casuals to formal dress shirts, shop the best cotton shirts online. Affordable luxury at its finest!" />
      <meta name="twitter:image" content="https://shopheed.com/assets/images/icon/logo.png" />
      <meta name="twitter:site" content="@shopheed" />
      <meta name="twitter:creator" content="@heed_creator" />
    </Head>
  );
};

export default HomeMetaTag;
