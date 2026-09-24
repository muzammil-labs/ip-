import { useEffect } from "react";
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

const SCREENS: Record<Screen, React.ComponentType> = {
  overview: Overview, ask: Ask, classify: Classify, tk: PriorArt,
  claims: ClaimCheck, sources: Sources, trust: Trust, blueprint: Blueprint,
};

export default function App() {
  const { screen } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const Active = SCREENS[screen];

  return (
    <Shell screenKey={screen}>
      <Active />
    </Shell>
  );
}
