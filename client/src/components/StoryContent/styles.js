import { TextFontStyle, BannerFontStyle, SubTitleFontStyle, TitleFontStyle } from "@/styles/shared/fonts";
import styled from "styled-components";
import { motion } from "framer-motion";


export const StyledStory = styled(motion.div)`
    h1 {
        ${BannerFontStyle}
        margin: 4rem 0rem;
    };

    h2{
        ${SubTitleFontStyle}
        font-size: 1.3rem;
        margin: 3rem 0rem 0.75rem;
        font-weight: 700;
    }
    p {
        ${TextFontStyle}
        line-height: 30px;
        margin: 20px 0px;
    }
    `;