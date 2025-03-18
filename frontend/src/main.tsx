import React from "react";
import ReactDOM from "react-dom/client";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { trpc } from "./trpc/client";
import { Provider } from "react-redux";
import store from "./redux/store";
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
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={client}>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ToastNotifier />
          <App />
        </QueryClientProvider>
      </Provider>
    </trpc.Provider>
  </React.StrictMode>
);
