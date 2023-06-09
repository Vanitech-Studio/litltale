import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { InView } from "react-intersection-observer";
import { Styled_ContentSection, InnerSection } from "./styles";

const ContentSection = ({children, direction, initialPosition, backgroundimage, className, firstSection}) => {

  if (direction === "y") {
    var containerVariants = {
      hidden: {
        opacity: 0,
        y: initialPosition,
        transition: {
          duration: 0.6,
          delay: 0.2
        }
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: 0.2
        },
      },
    }
  }

  if(direction === "x") {
    var containerVariants = {
      hidden: {
        opacity: 0,
        x: initialPosition,
        transition: {
          duration: 0.6,
          delay: 0.2
        }
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.6,
          delay: 0.2
        },
      },
    }
  }

  return (
    <Styled_ContentSection
    className={`d-block flex align-center justify-center flex-col ${className ? className : ''} ${firstSection ? "pt-24 lg:pt-36" : 'py-6'}`} 
    $backgroundimage={backgroundimage}
    >
      <InView threshold={0.5}>
        {({ ref, inView }) => (
          <InnerSection
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={`w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto`}
          >
            {children}
          </InnerSection>
        )}
      </InView>
    </Styled_ContentSection>
  );
}

export default ContentSection;
