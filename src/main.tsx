import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./state/store";
import { SessionProvider } from "./state/session";
import { CaseProvider } from "./state/case";
import "./styles/global.css";

async function startMocking() {
  const { worker } = await import("./api/mock/browser");
  // No real backend exists yet in any environment, so the mock worker always starts,
  // not just in dev. Base-relative URL so it resolves under vite's base: "./".
  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: "bypass",
  });
}

startMocking().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <SessionProvider>
      <CaseProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </CaseProvider>
    </SessionProvider>
  );
});
