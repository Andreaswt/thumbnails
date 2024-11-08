"use client";

import { useState } from "react";

const Style = ({
  image,
  selectStyle,
  isSelected,
}: {
  image: string;
  selectStyle: () => void;
  isSelected: boolean;
}) => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={selectStyle}
      className="relative w-fit cursor-pointer transition-all hover:scale-105"
    >
      {(mouseOver || isSelected) && (
        <>
          <div className="absolute -right-6 -top-4 h-4 w-4 -rotate-45 border-t border-black"></div>
          <div className="absolute -right-3 -top-6 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
          <div className="absolute -right-7 -top-0 h-4 w-4 rotate-[-20deg] border-t border-black"></div>
          <div className="absolute -bottom-6 -left-4 h-4 w-4 -rotate-45 border-t border-black"></div>
          <div className="absolute -bottom-3 -left-6 h-4 w-4 rotate-[-20deg] border-t border-black"></div>
          <div className="absolute -bottom-7 -left-0 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
        </>
      )}
      <img className="min-w-52 rounded-lg" src={image} />
    </div>
  );
};

export default Style;
