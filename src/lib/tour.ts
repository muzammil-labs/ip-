import { ANSWERS } from "../data/answers";
import { PRESETS } from "../data/constants";
import { performAsk } from "./ask";
import type { useApp } from "../state/store";

type App = ReturnType<typeof useApp>;

export interface TourStep {
  title: string;
  desc: string;
  run: (app: App) => void;
}

export const TOUR: TourStep[] = [
  {
    title: "Ask the golden question",
    desc: "A startup asks about patenting an Ashwagandha extract. Note the two columns and clause chips.",
    run: (app) => {
      app.go("ask");
      performAsk(app, ANSWERS[0].q);
    },
  },
  {
    title: "Open the disputed line",
    desc: "Commentators read the 2023 amendment differently. IP-SAKTI shows both and lowers the agreement score.",
    run: (app) => {
      app.go("ask");
      const a = performAsk(app, ANSWERS[0].q);
      const p = a.in?.pts.find((pt) => pt.s === "C");
      if (p) app.openSource(p.c[0], p);
    },
  },
  {
    title: "Switch to Hindi as a cultivator",
    desc: "The same system answers a grower in Hindi, with legal terms locked to a glossary.",
    run: (app) => {
      app.setLang("hi");
      app.setPersona("farmer");
      app.go("ask");
      performAsk(app, ANSWERS[3].q);
    },
  },
  {
    title: "Classify, then change one answer",
    desc: "Classify the extract, then make the roots wild-collected. Only the affected rows change.",
    run: (app) => {
      app.setLang("en");
      app.go("classify");
      app.setPrevRows(null);
      app.setCls({ ...PRESETS.ashwa });
      setTimeout(() => app.answerCls("src", "wild"), 500);
    },
  },
  {
    title: "Scan a risky advertisement",
    desc: "Prohibited claims are marked with the provision that bans them.",
    run: (app) => app.go("claims"),
  },
  {
    title: "See the law change",
    desc: "Rule 170 changed state three times. Answers relying on older text get flagged.",
    run: (app) => {
      app.go("sources");
      setTimeout(() => document.getElementById("rule170")?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    },
  },
  {
    title: "Ask what it shouldn't answer",
    desc: "A dosing question is declined, with a route to the right help.",
    run: (app) => {
      app.go("ask");
      performAsk(app, ANSWERS[5].q);
    },
  },
  {
    title: "Check the audit trail",
    desc: "Everything you just did is logged, without storing formulation details.",
    run: (app) => app.go("trust"),
  },
];
