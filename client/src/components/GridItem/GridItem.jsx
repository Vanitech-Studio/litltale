import React, { useState } from 'react';
import InViewElement from '../Animations/InViewElement';
import { Styled_GridItem, Styled_LoadingContainer } from "./styles"
import Text from '../Text';
import { RotateSpinner } from "react-spinners-kit";


const GridItem = ({ backgroundimage, title, is_ready, is_in_featured_section, is_loading_title, is_support_item, text}) => {

  return (
    <InViewElement className="d-block rounded-md overflow-hidden">
      {!is_in_featured_section && !is_support_item ? 
        <Styled_GridItem
        $is_ready={is_ready}
        className={`${is_ready ? "cursor-pointer" : ""} relative w-full p-5 rounded-lg h-64 sm:h-72 md:h-80 lg:h-96 xl:h-112`}
        style={{ height: "250px" }}
        $backgroundimage={backgroundimage}
        >
          <Text className="relative z-10" size="h3">{is_ready && title}</Text>
          {!is_ready &&
          <Styled_LoadingContainer className="z-10 absolute flex flex-col items-center justify-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <RotateSpinner size={30} color="white" loading={!is_ready} />
              <Text size={"sm"} className="mt-3 text-center">{is_loading_title}</Text>
          </Styled_LoadingContainer>
          }
        </Styled_GridItem>
        : 
        <Styled_GridItem
          $is_ready={is_in_featured_section || is_support_item}
          className={`cursor-pointer relative w-full p-5 rounded-lg h-64 sm:h-72 md:h-80 lg:h-96 xl:h-112`}
          style={{ height: "250px" }}
          $backgroundimage={backgroundimage}
          >
            <Text className="relative z-10 drop-shadow-lg text-shadow-sm" size="h3">{title}</Text>
            {is_support_item && 
            <Text className="relative z-10" size="sm">{text}</Text>
            }
        </Styled_GridItem>
      }
    </InViewElement>
  );
};


export default GridItem;