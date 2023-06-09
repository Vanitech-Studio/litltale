import React, { createContext, useEffect, useState } from "react";
import App from "next/app";
import { useRouter } from 'next/router';
import Head from "next/head";
import Script from 'next/script';

import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from 'react-toastify';

import { parseTheme } from "@/utils/parseTheme";
import { getStrapiMedia } from "../utils/media";
import { fetchAPI } from "@/utils/api";

import GLOBAL_DATA from "@/utils/data/global.json";
import DEFAULTPAGE_DATA from "@/utils/data/page.json";

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import Layout from "@/components/Layout";
import InViewContainer from '@/components/Animations/InViewElement';

export const GlobalContext = createContext({});

const MyApp = ({ Component, pageProps }) => {

  {/** Hydrating @Layout */}

  const router = useRouter();``

  useEffect(() => {
    console.log(pageProps);
  }, [])
  

  const { global, theme, seo } = pageProps;
  const data_seo = seo || DEFAULTPAGE_DATA.seo;
  const data_theme = parseTheme(theme?.color || DEFAULTPAGE_DATA.theme.color);
  const globalSeo = global?.attributes.seo || GLOBAL_DATA.seo;
  const routes = global?.attributes.navigation.routes.data || GLOBAL_DATA.navigation.data;
  const location = global?.attributes.location || GLOBAL_DATA.location;

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={getStrapiMedia(global?.attributes.seo?.favicon || GLOBAL_DATA.seo.favicon)}/>
      </Head>
        {/** GA */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
          `}
        </Script>
      <GlobalContext.Provider value={global?.attributes}>
        <Layout
          backgroundcolor={data_theme.background || "#000000"}
          color={data_theme.text || "#FFFFFF"}
          seo={data_seo}
          routes={routes}
          location={location}
          sitename={globalSeo.sitename}
          author={globalSeo.author}
          twitterHandle={globalSeo.twitter}
        >
          <AnimatePresence mode="wait">
              <motion.div
                key={router.route}
                initial={{  opacity: 0 }}
                animate={{  opacity: 1 }}
                exit={{ x: -100,opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <InViewContainer>
                  <Component {...pageProps} />
                </InViewContainer>
              </motion.div>
          </AnimatePresence>
          <ToastContainer />
        </Layout>
      </GlobalContext.Provider>
    </>
  );
};

MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);
  
  // Fetch global site settings from Strapi
  const [res] = await Promise.all([
    fetchAPI("/global", {
      cache: 'no-store',
      populate: {
        seo: {
          populate: "*"
        },
        navigation: {
          populate: "*"
        },
        location: {
          populate:"*"
        },
        support: {
          populate: "*"
        }
      }
    })
  ]);

  // Pass the data to our page via props
  return { ...appProps, pageProps: { global: res.data }
};
};

export default MyApp;
