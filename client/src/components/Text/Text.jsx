import { motion } from "framer-motion";
import { StyledText, Small, SubTitle, BaselineTitle, Title } from "./styles"; 

const Text = ({children, size, className}) => {
  return (
    <>
      {/** Small  */}
      {size === "sm" &&
        <Small className={`${className ? className : ""}`}>
          {children}
        </Small>
      }
      
      {/** Paragraph  */}
      {!size &&
        <StyledText className={`${className ? className : ""}`}>
          {children}
        </StyledText>
      }

      {/** BaselineTitle  */}
      {size === "h3" &&
        <BaselineTitle className={`${className ? className : ""}`}>
            {children}
        </BaselineTitle>
      }

      {/** Subtitle  */}
      {size === "h2" &&
        <SubTitle className={`${className ? className : ""}`}>
            {children}
        </SubTitle>
      }

      {/** Title  */}
      {size === "h1" &&
        <Title className={`${className ? className : ""}`}>
          {children}
        </Title>
      }

    </>
  );
}

export default Text;
