import React from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { sanitizeString } from "../utils/utils";
import useLocalStorage from "../hooks/useLocalStorage";

export const ToastNotifier = () => {
  const [colorMode] = useLocalStorage("color-theme", "light");

  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={sanitizeString(colorMode || "light")}
      transition={Bounce}
    />
  );
};
