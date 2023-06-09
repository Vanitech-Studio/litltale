import { motion } from "framer-motion";

const AnimateBaseline = ({ children, className, delayStep = 0.8 }) => {
  const letterVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * delayStep
      }
    }),
  };

  return children.map((child, i) => (
    <motion.div
      key={i}
      className={className ? className : ""}
      variants={letterVariants}
      initial="hidden"
      animate="visible"
      custom={i}
    >
      {child}
    </motion.div>
  ));
};

export default AnimateBaseline;
