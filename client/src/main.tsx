import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { Provider as ReduxProvider } from "react-redux";
import { msalInstance } from "./lib/msal";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </ReduxProvider>
);
