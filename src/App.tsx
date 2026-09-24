import { lazy, Suspense, useEffect, useState } from "react";
import { useApp } from "./state/store";
import Shell from "./app/Shell";
import Overview from "./screens/Overview";
import Ask from "./screens/Ask";
import Classify from "./screens/Classify";
import PriorArt from "./screens/PriorArt";
import ClaimCheck from "./screens/ClaimCheck";
import Sources from "./screens/Sources";
import Trust from "./screens/Trust";
import Blueprint from "./screens/Blueprint";
import type { Screen } from "./state/store";

// Lazy: pulls in Radix and every src/ui primitive, and is never reached in the shipped
// demo path, so it must not add to the main bundle's initial gzip (Part E budget).
const DevUI = lazy(() => import("./pages/DevUI"));

const SCREENS: Record<Screen, React.ComponentType> = {
  overview: Overview, ask: Ask, classify: Classify, tk: PriorArt,
  claims: ClaimCheck, sources: Sources, trust: Trust, blueprint: Blueprint,
};

/** Minimal bridge to reach the hidden #/dev/ui story page before UI-3.1 adds the real hash router. */
function useIsDevUI() {
  const [isDevUI, setIsDevUI] = useState(() => window.location.hash.startsWith("#/dev/ui"));
  useEffect(() => {
    const onHashChange = () => setIsDevUI(window.location.hash.startsWith("#/dev/ui"));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return isDevUI;
}

export default function App() {
  const { screen } = useApp();
  const isDevUI = useIsDevUI();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen, isDevUI]);

  if (isDevUI) {
    return (
      <Shell screenKey="dev-ui">
        <Suspense fallback={null}>
          <DevUI />
        </Suspense>
      </Shell>
    );
  }

  const Active = SCREENS[screen];

  return (
    <Shell screenKey={screen}>
      <Active />
    </Shell>
  );
}
