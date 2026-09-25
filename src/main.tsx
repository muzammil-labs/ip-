import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./state/store";
import { SessionProvider } from "./state/session";
import { CaseProvider } from "./state/case";
import { CoverageProvider } from "./state/coverage";
import "./styles/global.css";

async function startMocking() {
  const { worker } = await import("./api/mock/browser");
  // No real backend exists yet in any environment, so the mock worker always starts,
  // not just in dev. Base-relative URL so it resolves under vite's base: "./".
  //
  // In a built app (UI-5.2), MSW registers the PWA's own merged service worker
  // (sw.js, built from src/sw.ts) instead of the plain mockServiceWorker.js: that
  // file already imports mockServiceWorker.js's logic via importScripts, so this is
  // still the same mock behaviour, just sharing one worker/one registration with
  // Workbox's precaching instead of a second, competing registration at the same
  // scope. Dev keeps the plain worker: the PWA service worker only exists in a build.
  const swFile = import.meta.env.DEV ? "mockServiceWorker.js" : "sw.js";
  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}${swFile}` },
    onUnhandledRequest: "bypass",
  });
}

startMocking().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <SessionProvider>
      <CaseProvider>
        <CoverageProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </CoverageProvider>
      </CaseProvider>
    </SessionProvider>
  );
});
