import React, { useState, useEffect } from "react";
import { ParallaxContainer } from "./styles";
const Parallax = ({ children, speed }) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
      function handleScroll() {
        setScrollPosition(window.scrollY);
      }
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    const parallaxStyle = {
      transform: `translateY(-${scrollPosition * speed}px)`,
    };
  
    return <ParallaxContainer style={parallaxStyle}>{children}</ParallaxContainer>;
}

export default Parallax;