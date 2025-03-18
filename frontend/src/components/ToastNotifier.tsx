import React from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { sanitizeString } from "../utils/utils";

export const ToastNotifier = () => {
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
      theme={sanitizeString("light")}
      transition={Bounce}
    />
  );
};
