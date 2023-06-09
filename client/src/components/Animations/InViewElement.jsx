import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const InViewElement = ({ children, className, index = 0, delayStep = 0.2 }) => {

  const animation = useAnimation();
  const [contentRef, inView] = useInView({
    triggerOnce: true,  // Animation will only trigger once
  });

  const delay = index * delayStep; // Delay is based on index

  useEffect(() => {
    if (inView) {
      animation.start("visible");
    }
  }, [animation, inView]);

  return (
    <motion.div
      ref={contentRef}
      animate={animation}
      initial="hidden"
      className={""}
      variants={{
        hidden: {
          opacity: 0,
          y: -10,
          scale: 0.9
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: delay,  // Apply the calculated delay
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const InViewContainer = ({ children, delayStep = 0.2 }) => {
  return React.Children.toArray(children).map((child, i) => (
    <InViewElement key={i} index={i} delayStep={delayStep}>
      {child}
    </InViewElement>
  ));
};

export default InViewContainer;