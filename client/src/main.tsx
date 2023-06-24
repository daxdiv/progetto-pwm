import { QueryClient, QueryClientProvider } from "react-query";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
