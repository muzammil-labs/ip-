import { Leaf } from "@phosphor-icons/react";
import { useT } from "../i18n/useT";

export interface PlateProps {
  /** public/plates path without size suffix or extension, e.g. "ashwagandha" for ashwagandha-480.webp etc. */
  slug?: string;
  /** Botanical name (rendered in italic) and common names. */
  botanicalName: string;
  commonNames?: string;
  creditHref?: string;
}

/**
 * A botanical plate: real, licence-checked photography only (C6), duotone-treated via
 * the .plate CSS class (Appendix D). Until a slug's images exist in public/plates/, this
 * renders a designed placeholder (tinted tile, leaf mark, the botanical name) rather than
 * the generic dashed "no content" EmptyState: a decorative image slot on a marketing
 * surface (Home) reads as broken when it borrows the same treatment used for genuine
 * empty data elsewhere in the app, even though neither fakes a photograph.
 */
export default function Plate({ slug, botanicalName, commonNames, creditHref }: PlateProps) {
  const t = useT();
  if (!slug) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-container border border-line bg-neem-wash px-6 text-center">
        <Leaf size={28} weight="duotone" className="text-neem-strong/70" />
        <p className="max-w-[28ch] text-small italic text-neem-strong/80">{botanicalName}</p>
      </div>
    );
  }

  return (
    <figure>
      <div className="plate aspect-[4/3] w-full">
        <img
          src={`/plates/${slug}-960.webp`}
          srcSet={`/plates/${slug}-480.webp 480w, /plates/${slug}-960.webp 960w, /plates/${slug}-1440.webp 1440w`}
          sizes="(min-width: 1024px) 480px, 100vw"
          alt={botanicalName}
          loading="lazy"
          width={960}
          height={720}
        />
      </div>
      <figcaption className="mt-2 text-small text-ink-3">
        <span className="italic">{botanicalName}</span>
        {commonNames && <>, {commonNames}</>}
        {creditHref && (
          <>
            {" · "}
            <a href={creditHref} target="_blank" rel="noopener" className="underline hover:text-ink-2">
              {t("plateCredit")}
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}
