import styled from "styled-components";
import { SmallFontStyle, TextFontStyle, SubTitleFontStyle, BaselineFontStyle, TitleFontStyle } from "@/styles/shared/fonts";
import { Baseline } from "../Banner/styles";


export const Small = styled.small`
    ${SmallFontStyle}
`;

export const StyledText = styled.p`
    ${TextFontStyle}
`;

export const SubTitle = styled.h2`
    ${SubTitleFontStyle}
`;

export const BaselineTitle = styled.h3`
    ${BaselineFontStyle}
`;

export const Title = styled.h1`
    ${TitleFontStyle}
`;