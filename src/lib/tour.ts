import { ANSWERS } from "../data/answers";
import { PRESETS } from "../data/constants";
import { performAsk } from "../engines/ask";
import type { useApp } from "../state/store";
import type { useSession } from "../state/session";

type App = ReturnType<typeof useApp> & ReturnType<typeof useSession>;

export interface TourStep {
  titleKey: string;
  descKey: string;
  run: (app: App) => void;
}

export const TOUR: TourStep[] = [
  {
    titleKey: "tour0title",
    descKey: "tour0desc",
    run: (app) => {
      app.go("ask");
      performAsk(app, ANSWERS[0].q);
    },
  },
  {
    titleKey: "tour1title",
    descKey: "tour1desc",
    run: (app) => {
      app.go("ask");
      const a = performAsk(app, ANSWERS[0].q);
      const p = a.in?.pts.find((pt) => pt.s === "C");
      if (p) app.openClauseSheet(p.c[0], p);
    },
  },
  {
    titleKey: "tour2title",
    descKey: "tour2desc",
    run: (app) => {
      app.setLang("hi");
      app.setPersona("farmer");
      app.go("ask");
      performAsk(app, ANSWERS[3].q);
    },
  },
  {
    titleKey: "tour3title",
    descKey: "tour3desc",
    run: (app) => {
      app.setLang("en");
      app.go("classify");
      app.setPrevRows(null);
      app.setCls({ ...PRESETS.ashwa });
      setTimeout(() => app.answerCls("src", "wild"), 500);
    },
  },
  {
    titleKey: "tour4title",
    descKey: "tour4desc",
    run: (app) => app.go("claims"),
  },
  {
    titleKey: "tour5title",
    descKey: "tour5desc",
    run: (app) => {
      app.go("sources");
      setTimeout(() => document.getElementById("rule170")?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    },
  },
  {
    titleKey: "tour6title",
    descKey: "tour6desc",
    run: (app) => {
      app.go("ask");
      performAsk(app, ANSWERS[5].q);
    },
  },
  {
    titleKey: "tour7title",
    descKey: "tour7desc",
    run: (app) => app.go("trust"),
  },
];
