import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./App.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
