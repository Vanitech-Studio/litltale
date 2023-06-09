import { motion, useAnimation } from "framer-motion";

const AnimateTitle = ({ text, className }) => {
  const wordVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 50, x: 50, opacity: 0 },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div key="parent"
    variants={wordVariants} initial="hidden" animate="visible" exit="hidden">
      {text.split("").map((letter, index) => (
        <motion.p className={className} style={{display: "inline-block"}} key={index} variants={letterVariants}>
          {letter}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default AnimateTitle;
