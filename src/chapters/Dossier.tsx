import { useState } from "react";
import { LinkSimple, Check } from "@phosphor-icons/react";
import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { shareLinkFor } from "../lib/shareLink";

/** Case chapter 7: dossier (B2). The dossier engine and export are built in Phase 6; the UI-3.4 share link already works. */
export default function Dossier() {
  const t = useT();
  const { case: kase } = useCase();
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const link = shareLinkFor(kase);
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard API unavailable or denied; the link is still valid, just not auto-copied.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Chapter n={7} titleKey="chDossierTitle" purposeKey="chDossierPurpose">
      <div className="flex flex-col gap-4">
        <Button variant="secondary" icon={copied ? <Check size={16} /> : <LinkSimple size={16} />} onClick={copyLink}>
          {copied ? t("linkCopied") : t("copyLink")}
        </Button>
        <EmptyState message={t("chDossierBody")} />
      </div>
    </Chapter>
  );
}
