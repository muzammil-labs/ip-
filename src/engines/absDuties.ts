import { absOf, categoryOf } from "./classify";
import type { Case } from "../state/case";

/** Case-based wrapper over absOf, kept as its own module per the D2 target file structure. */
export function absDuties(kase: Case): [string, string[]] {
  return absOf(kase.answers, categoryOf(kase.answers));
}
