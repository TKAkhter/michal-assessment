import React from "react";
import LogoLight from "../assets/logo.png";
import { JSX } from "react/jsx-runtime";

export const Logo = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLImageElement> & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <>
      <img src={LogoLight} alt="Logo" className="" {...props} />
    </>
  );
};
