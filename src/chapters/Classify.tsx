import ClassifyScreen from "../screens/Classify";

/** Case chapter 2: classify (B2, B3). Temporarily re-exports the pre-redesign Classify screen, which already has its own header; the Chapter primitive wrapper (with TK proximity added, per B3) lands in Phase 4. */
export default function Classify() {
  return <ClassifyScreen />;
}
