import { motion } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";
import { TextFontStyle, LogoFontStyle } from "@/styles/shared/fonts";

export const StyledFooter = styled(motion.footer)`
    color: ${props => props.$color};
    background-color: transparent;
    `;

export const Styled_Link = styled(Link)`
    ${TextFontStyle}
`;

export const Logo = styled(Link)`
    ${LogoFontStyle}
`;
