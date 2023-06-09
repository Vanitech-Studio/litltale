import React, { useState } from 'react';
import InViewElement from '../Animations/InViewElement';


const Grid = ({ children }) => {

  return (
      <section
        className={`grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
        {children}
      </section>
  );
};


export default Grid;