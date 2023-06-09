import React, { useEffect, useState } from "react"; 
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Styled_Banner, ContainerTitle, Title, Baseline } from "./styles";
import AnimateTitle from "../Animations/AnimateTitle";
import AnimateBaseline from "../Animations/AnimateBaseline";
import Parallax from "../Animations/Parallax";

const Banner = ({backgroundimage, backgroundcolor, color, title, baseline, className}) => {

    return (
    <Container className={className ? className : null} $color={color} $backgroundcolor={backgroundcolor}>
        <Parallax speed={0.2}>
            <Styled_Banner 
                $backgroundimage={backgroundimage}
                className={`relative h-screen`}
                >
                <AnimatePresence mode="wait">
                    <ContainerTitle className={`block absolute bottom-10 left-10`}>
                        {title && (
                        <Title>
                                <AnimateTitle text={title}/>
                        </Title>
                        )}
                        {baseline && (
                        <Baseline>
                            <AnimateBaseline>
                                {baseline}
                            </AnimateBaseline>
                        </Baseline>
                        )}
                    </ContainerTitle>
                </AnimatePresence>
            </Styled_Banner>
        </Parallax>
    </Container>
    )

}

export default Banner;