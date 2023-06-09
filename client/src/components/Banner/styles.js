import { motion } from "framer-motion";
import styled from "styled-components";
import { BannerFontStyle, BaselineFontStyle } from "../../styles/shared/fonts";


export const Container = styled.div`
    ${({ $color }) => $color ? `
        color: ${$color};
    `:
        'color: white;'
    }
    
    ${({ $backgroundcolor }) => $backgroundcolor ? `
        background-color: ${$backgroundcolor};
    `:
        'background-color: black;'
    }

    ${({ $backgroundimage }) => $backgroundimage && `
        background-image: url(${$backgroundimage});
        background-size: cover;
        background-repeat: no-repeat;
    `}
`;

export const Styled_Banner = styled(motion.div)`
    ${({ $backgroundimage }) => $backgroundimage && `
    background-image: url(${$backgroundimage});
    background-size: cover;
    background-repeat: no-repeat;
    `}
`;

export const ContainerTitle = styled(motion.div)`
    
`;

export const Title = styled(motion.h2)`
    ${BannerFontStyle};
`;

export const Baseline = styled(motion.h3)`
    ${BaselineFontStyle};
`;