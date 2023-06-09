import React, { useEffect, useState } from "react"; 
import Seo from "../Seo";
import Navbar from "../Navbar";
import Footer from "../Footer";

import { StyledLayout } from "./styles";

const Layout = ({ 
    extraProps,
    children, 
    routes,
    twitterHandle, 
    sitename, 
    location,
    author, 
    color, 
    globalseo, 
    seo }) => {

    return (
        <StyledLayout className="bg-gradient-slate">
            <Seo 
            author={author} 
            sitename={sitename} 
            twitterHandle={twitterHandle} 
            globalseo={globalseo} 
            seo={seo}
            />
            <Navbar     
            color={color} 
            sitename={sitename}
            routes={routes}
            />
            {children}
        </StyledLayout>
    )
}
 
export default Layout;