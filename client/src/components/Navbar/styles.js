import { motion } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";
import { TextFontStyle, LogoFontStyle } from "@/styles/shared/fonts";

export const NavContainer = styled(motion.nav)`
    position: fixed;
    z-index: 999;
    color: ${props => props.$color};
`;

export const Styled_Link = styled(Link)`
    position: relative;
    ${TextFontStyle}
`;

export const Logo = styled(Link)`
    ${LogoFontStyle}
`;


export const Line = styled(motion.span)`
position: absolute;
width: 100%;
bottom: -3px;
left: 0;
height: 1px;
background-color: #fff;`;

