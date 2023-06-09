import React, { useEffect, useState } from "react"; 

import { StyledStory } from "./styles";

const StoryContent = ({ children }) => {

    return (
        <StyledStory>
            {children}
        </StyledStory>
    )
}
 
export default StoryContent;