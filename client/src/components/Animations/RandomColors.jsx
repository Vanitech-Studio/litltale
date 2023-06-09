import React from "react";
import colors from "@/utils/colors";

const RandomColors = ({children}) => {

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      }
    
      const chars = children.toString().split("");
      const spans = chars.map((char, index) => (
        <span key={index} style={{ color: getRandomColor() }}>
          {char}
        </span>
      ));

  return <div>{spans}</div>;
}

export default RandomColors;
