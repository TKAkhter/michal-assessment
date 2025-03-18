import React from "react";
export const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white bg-opacity-50 fixed w-full top-0 left-0 right-0 z-10">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};
