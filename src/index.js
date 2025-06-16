import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import "./styles/signup.css"; 
import "bootstrap/dist/css/bootstrap.min.css"; 

import App from "./App.tsx";
import { store } from "./store/index.ts";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")); // ! لتأكيد أن العنصر موجود، وهو شائع في React 18+

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </QueryClientProvider>
);