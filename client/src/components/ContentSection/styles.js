import styled from "styled-components";
import { motion } from "framer-motion";

export const Styled_ContentSection = styled.div`
    ${({ $color }) => $color ? `
        color: ${$color};
    `:
        'color: white;'
    }


    ${({ $backgroundimage }) => $backgroundimage && `
        background-image: url(${$backgroundimage});
        background-size: cover;
        background-repeat: no-repeat;
    `}
`;

export const InnerSection = styled(motion.div)`
    padding: 0px 20px;
`
