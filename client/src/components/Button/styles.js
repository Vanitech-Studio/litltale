import styled from "styled-components";
import { SmallFontStyle } from "@/styles/shared/fonts";

export const ButtonPrimary = styled.button`
    display: block;
    background-color: ${props => props.$primary};
    color: white;
`;

export const Span = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    ${SmallFontStyle}
`;