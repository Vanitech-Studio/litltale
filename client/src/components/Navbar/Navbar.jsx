import React, { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { NavContainer, Logo, Styled_Link, Line } from "./styles";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import Image from "next/image";

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Styled_Link className={isActive ? "active" : ""} scroll={false} href={href}>
      {isActive && (
        <Line
          initial={{x: -10, opacity: 0}}
          animate={{x: 0, opacity: 1 }}
          exit={{y: -10}}
          transition={{ duration: 0.4 }}
          className="line"
        />
      )}
      {children}
    </Styled_Link>
  );
};

const Navbar = ({ color, sitename, routes }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [link, setLink] = useState('');
  const [auth, setAuth] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const tokenFromCookie = Cookies.get('accessToken');
    const userAuth = Cookies.get('auth');

    setToken(tokenFromCookie);
    setAuth(userAuth);
  }, [])

  useEffect(() => {
    console.log(router);
    if(token && auth) {
     setLink(`/generate`)
    } else {
      setLink('/')
    }
    if(router.pathname === "/generate") {
      setLink('/generate');
    }
    if(router.pathname === "/generating") {
      setLink('/generate');
    }
  }, [token, auth])


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;
      const isScrollingDown = currentScrollPosition > lastScrollPosition;
      const isScrollingUp = currentScrollPosition < lastScrollPosition;
      
      if(isScrollingDown) {
        setShowNavbar(false);
      } else if(isScrollingUp && currentScrollPosition < 250) {
        setShowNavbar(true);
      }

      setLastScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  return (
    <NavContainer
      initial={{ y: 0 }}
      $color={color}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.4 }}
      className={`w-full`}
    >
      <div className="container w-full max-w-full sm:max-w-screen-sm px-5 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between ">
          <div className="flex-shrink-0">
            <Logo href={link} className="w-full d-block">
            <Image className="h-auto max-w-full" src="/img/litltale-logo.png" width={180} height={180}  alt="logo description"/>
            </Logo>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {routes?.map((item) => (
                <NavLink key={item.id} href={`/${item.attributes.slug}`}>
                  {item.attributes.pagename}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </NavContainer>
  );
};

export default Navbar;
