import React, {useEffect} from "react";

import Layout from "../components/Layout";
import Banner from "../components/Banner";

import { fetchAPI } from "@/utils/api";
import { parseTheme } from "@/utils/parseTheme";
import { getStrapiMedia } from "@/utils/media";

import DEFAULTPAGE_DATA from "@/utils/data/page.json";

export const NotFound = ({ 
  banner, 
  theme,
 }) => {


    const data_banner = banner || DEFAULTPAGE_DATA.banner;
    const data_theme = parseTheme(theme?.color || DEFAULTPAGE_DATA.theme.color);

      console.log(data_banner);

  return (
    <>404</>

  )

}

export async function getStaticProps() {
  const [res] = await Promise.all([
    fetchAPI("/not-found", { 
     populate: {
      banner: {
        populate: {
          backgroundcolor: {
            populate: "*",
          },
          backgroundimage: true,
          color: true,
        },
      },
      seo: {
        populate: "*",
      },
      theme: {
        populate: {
          color: {
            populate: "*",
          }
        }
      },
     }
    }),
  ]);

  // Pass the data to our page via props
  return { 
    props: {  
      theme: res.data?.attributes.theme || null,
      seo: res.data?.attributes.seo || null,
      banner: res.data?.attributes.banner || null
    }
   };
}

export default NotFound;