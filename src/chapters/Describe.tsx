import { useEffect, useRef } from "react";
import { useSearch } from "wouter";
import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { decodeSharedCase } from "../lib/shareLink";

/** Case chapter 1: describe (B2). Case intake (product, formula, markets) is built in Phase 4, on top of the Case model from UI-3.2. Also handles UI-3.4's share link: #/case/describe?c=... */
export default function Describe() {
  const t = useT();
  const search = useSearch();
  const { case: kase, dispatch } = useCase();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const encoded = params.get("c");
    if (!encoded || handled.current === encoded) return;
    handled.current = encoded;

    const shared = decodeSharedCase(encoded);
    if (!shared) return;

    const hasExistingContent = kase.product.name.trim().length > 0;
    const isSameCase = kase.product.name === shared.product.name && JSON.stringify(kase.formula) === JSON.stringify(shared.formula);
    if (hasExistingContent && !isSameCase) {
      if (!window.confirm(t("confirmLoadSharedCase"))) return;
    }
    dispatch({ type: "loadShared", shared });
  }, [search, kase, dispatch, t]);

  return (
    <Chapter n={1} titleKey="chDescribeTitle" purposeKey="chDescribePurpose">
      <EmptyState message={t("chDescribeBody")} />
    </Chapter>
  );
}
