import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./state/store";
import { SessionProvider } from "./state/session";
import { CaseProvider } from "./state/case";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <SessionProvider>
    <CaseProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </CaseProvider>
  </SessionProvider>
);
