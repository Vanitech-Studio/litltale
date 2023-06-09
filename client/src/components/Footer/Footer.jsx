import React, { useEffect, useState } from "react"; 
import { motion, useScroll } from 'framer-motion';
import { StyledFooter, Logo, Styled_Link } from "./styles";

import Text from "../Text";
import Script from "next/script";
const Footer = ({ color, backgroundcolor, sitename, location }) => {

  return (
      <StyledFooter
      $color={color}
      $backgroundcolor={backgroundcolor}
      className={`w-full`}
      >
      <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:block md:flex md:items-center md:justify-around py-4">
          <Text size="sm">{location.adress}</Text>
          <Text size="sm">
            <a href={`mailto:${location.email}`}>
              {location.email}
            </a>
          </Text>
        </div>
        <div className="sm:block md:flex md:items-center md:justify-around py-4">
          <Text size="sm">©{sitename}, tout droits reservés.</Text>
        </div>
      </div>

      {/** SCRIPTS GOOGLE TAG */}
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}`}/>         
      <Script id="google-analytics" strategy="afterInteractive">
        {`  
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
          `}
        </Script>
        {/** AXEPTIO TAG */}
        <Script dangerouslySetInnerHTML={{ __html: `
          window.axeptioSettings = {
            clientId: '${process.env.NEXT_PUBLIC_AXEPTIO_CLIENT_ID}',
          };
          
          (function(d, s) {
        
            var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
            e.async = true; e.src = "//static.axept.io/sdk-slim.js";
            t.parentNode.insertBefore(e, t);
        
          })(document, "script");` }} />
    </StyledFooter>
  )
}

export default Footer;