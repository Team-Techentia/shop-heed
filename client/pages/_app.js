import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../public/assets/scss/app.scss";
import { ToastContainer } from "react-toastify";
import TapTop from "../components/common/widgets/Tap-Top";
import CartContextProvider from "../helpers/cart/CartContext";
import { WishlistContextProvider } from "../helpers/wishlist/WishlistContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import SettingProvider from "../helpers/theme-setting/SettingProvider";
import { CompareContextProvider } from "../helpers/Compare/CompareContext";
import { CurrencyContextProvider } from "../helpers/Currency/CurrencyContext";
import { Helmet } from "react-helmet";
import UserProvider from "../helpers/user/UserProvider";
import { LoaderProvider } from "../helpers/loaderContext";
import "../public/assets/scss/fonts.css";
import logo from "../public/assets/images/icon/logo1.png";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import HomeMetaTag from "./MetaTag/homeMetaTag";

export default function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader-wrapper">
          <img src={logo.src} alt="Loading" />
        </div>
      ) : (
        <>
          <Helmet>
            {/* Viewport and Title */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Heed</title>
            <Head>
            <meta name="google-site-verification" content="RhOqAh2ormhGi8dToKzxGbnSkwj-1HPk4_xeZ4K-SWo" />
            {/* Google Tag Manager Script */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){
                    w[l]=w[l]||[];
                    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true;
                    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-TV62TXLG');
                `,
              }}
            />
            </Head>

            {/* NoScript with dangerouslySetInnerHTML */}
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
                  <iframe 
                    src="https://www.googletagmanager.com/ns.html?id=GTM-TV62TXLG"
                    height="0" 
                    width="0" 
                    style="display:none; visibility:hidden"
                    title="Google Tag Manager"
                  ></iframe>
                `,
              }}
            />
          </Helmet>

          <div>
            <QueryClientProvider client={queryClient}>
              <HydrationBoundary state={pageProps.dehydratedState}>
                <LoaderProvider>
                  <UserProvider>
                    <SettingProvider>
                      <CompareContextProvider>
                        <CurrencyContextProvider>
                          <CartContextProvider>
                            <WishlistContextProvider>
                              <FilterProvider>
                                <Component {...pageProps} />
                              </FilterProvider>
                            </WishlistContextProvider>
                          </CartContextProvider>
                        </CurrencyContextProvider>
                      </CompareContextProvider>
                    </SettingProvider>
                  </UserProvider>
                  <ToastContainer />
                  <TapTop />
                </LoaderProvider>
              </HydrationBoundary>
            </QueryClientProvider>
          </div>
        </>
      )}
    </>
  );
}
