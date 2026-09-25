import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation, useParams } from "wouter";
import { CHAPTERS, CHAPTER_ORDER, type ChapterSlug } from "../chapters";
import { useT } from "../i18n/useT";
import EmptyState from "../ui/EmptyState";

// Lazy: ChapterStepper pulls in the Sheet primitive (Radix), keeping it off the main bundle (Part E's 200KB gzip budget).
const ChapterRail = lazy(() => import("../ui/ChapterRail"));
const ChapterStepper = lazy(() => import("../ui/ChapterStepper"));

const Home = lazy(() => import("../pages/Home"));
const Library = lazy(() => import("../pages/Library"));
const SourcePage = lazy(() => import("../pages/SourcePage"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const AskPage = lazy(() => import("../pages/AskPage"));
const DossierPrint = lazy(() => import("../pages/DossierPrint"));
const Facilitator = lazy(() => import("../pages/Facilitator"));
// Hidden story page: pulls in Radix and every src/ui primitive, kept off the main bundle.
const DevUI = lazy(() => import("../pages/DevUI"));

function isChapterSlug(s: string): s is ChapterSlug {
  return (CHAPTER_ORDER as string[]).includes(s);
}

/** #/case/:chapter (B2): looks up the chapter component, or redirects to the first chapter on an unknown slug.
 * UI-4.11: the chapter rail sits as a sticky left sidebar at ≥1024px; below that, a stepper bar replaces it. */
function CaseChapterRoute() {
  const { chapter } = useParams<{ chapter: string }>();
  if (!chapter || !isChapterSlug(chapter)) return <Redirect to={`/case/${CHAPTER_ORDER[0]}`} />;
  const Chapter = CHAPTERS[chapter];
  return (
    <div>
      <ChapterStepper current={chapter} />
      <div className="mx-auto flex max-w-[var(--w-shell)] items-start gap-8 px-4 py-6 sm:px-6 lg:py-10">
        <div className="sticky top-24 hidden shrink-0 lg:block">
          <ChapterRail current={chapter} />
        </div>
        <div className="min-w-0 flex-1">
          <Chapter />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
      <EmptyState message={t("routeNotFound")} />
    </div>
  );
}

/** Scrolls to top on route change only, never on chapter-internal state changes (UI-3.1). */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

/** Rendered inside Shell, which is itself inside the top-level Router (App.tsx), so Shell's own useLocation() call for page-transition keys shares the same hash-routed location. */
export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/case/:chapter" component={CaseChapterRoute} />
          <Route path="/library" component={Library} />
          <Route path="/library/:sourceId" component={SourcePage} />
          <Route path="/how" component={HowItWorks} />
          <Route path="/ask" component={AskPage} />
          <Route path="/dossier/print" component={DossierPrint} />
          <Route path="/facilitator" component={Facilitator} />
          <Route path="/dev/ui" component={DevUI} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}
