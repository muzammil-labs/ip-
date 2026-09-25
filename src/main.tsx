import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./state/store";
import { SessionProvider } from "./state/session";
import { CaseProvider } from "./state/case";
import { CoverageProvider } from "./state/coverage";
import "./styles/global.css";

// If a lazy-loaded chunk fails to fetch (stale cache after a deploy, a flaky connection),
// Vite's dynamic import() throws and nothing here catches it, leaving whatever was mid-render
// blank forever. Reload once to pick up the current deploy's file list; a session flag stops a
// reload loop if the fetch keeps failing for a reason a reload can't fix.
function installChunkErrorRecovery() {
  const FLAG = "ips.chunkReload";
  const recover = () => {
    if (sessionStorage.getItem(FLAG)) return;
    sessionStorage.setItem(FLAG, "1");
    location.reload();
  };
  window.addEventListener("error", (e) => {
    if (/Failed to fetch dynamically imported module|Loading chunk/i.test(e.message ?? "")) recover();
  });
  window.addEventListener("unhandledrejection", (e) => {
    if (/Failed to fetch dynamically imported module|Loading chunk/i.test(String(e.reason?.message ?? e.reason ?? ""))) recover();
  });
}

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

// A stalled or slow service-worker install (a bad connection, a first visit fetching every
// precached asset) must never keep the app itself off-screen: race the mock worker's startup
// against a timeout and render regardless of which settles first. Requests made before the
// worker is ready just miss the mock and get a real network error, which the app's existing
// "couldn't load" states already handle; that is far better than an indefinite blank page.
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([p, new Promise<void>((resolve) => setTimeout(resolve, ms))]);
}

installChunkErrorRecovery();

withTimeout(startMocking(), 3000).finally(() => {
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
  // Reaching a render means this load is healthy; let a later, unrelated chunk failure
  // in the same tab still get its one recovery reload instead of being silently skipped.
  sessionStorage.removeItem("ips.chunkReload");
});
