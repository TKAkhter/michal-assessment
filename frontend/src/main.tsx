import React from "react";
import ReactDOM from "react-dom/client";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { trpc } from "./trpc/client";
import { BrowserRouter } from "react-router-dom";
import { ToastNotifier } from "./components/ToastNotifier";

const client = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_API_URL}/trpc`,
    }),
  ],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={client}>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ToastNotifier />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </trpc.Provider>
);
