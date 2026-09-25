import Overview from "../screens/Overview";

/**
 * #/ (B2). Temporarily re-exports the pre-redesign Overview screen as-is; the real Home
 * (hero, three example cases from UI-3.3, how-a-case-works, trust strip) is built in
 * Phase 4. This wrapper exists so the route is real and routable now.
 */
export default function Home() {
  return <Overview />;
}
