import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { opacity: 0.5; }
`;

export const Styled_GridItem = styled.div`
  position: relative;
  background-image: ${props => {
    return `url(${props.$backgroundimage})`;
  }};
  background-size: cover;
  background-position: center;
  transition: 0.2s ease-in-out all;
  overflow: hidden;
  &:hover {
    scale: 1.05;
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${props => {
      const gradientColor = props.$is_ready ? 'rgba(0, 0, 0, 0.33)' : 'rgba(0, 0, 0, 0.75)';
      return `linear-gradient(${gradientColor}, ${gradientColor})`;
    }};
    background-size: cover;
    background-position: center;
    transition: 0.2s ease-in-out opacity;
  }
`;

export const Styled_LoadingContainer = styled.div`
  /* Vos styles pour le conteneur de chargement */
`;