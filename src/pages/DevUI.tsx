import { useState } from "react";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { Chip, StatusChip } from "../ui/Chip";
import Segmented from "../ui/Segmented";
import { Field, TextArea } from "../ui/Field";
import RadioCards from "../ui/RadioCards";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import Finding from "../ui/Finding";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import CiteChip from "../ui/CiteChip";
import Seal from "../ui/Seal";
import Pips from "../ui/Pips";
import DiffMark from "../ui/DiffMark";
import Callout from "../ui/Callout";
import EmptyState from "../ui/EmptyState";
import { FindingSkeleton, EvidenceRowSkeleton, DataTableRowSkeleton } from "../ui/Skeleton";
import Sheet from "../ui/Sheet";
import Tooltip, { TooltipProvider } from "../ui/Tooltip";
import Plate from "../ui/Plate";
import DataTable from "../ui/DataTable";

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-6">
      <h3 className="mb-3 text-small font-semibold uppercase tracking-wide text-ink-3">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const DEMO_ROWS = [
  { id: "1", name: "Patents Act, 1970", tier: "Tier 0" },
  { id: "2", name: "TKDL", tier: "Tier 1" },
];

/**
 * Hidden story page: every src/ui primitive in every state, light and dark. Used by
 * scripts/shots.mjs to catch contrast and overflow problems across the whole system at
 * once. Not linked from any nav; reached only at #/dev/ui.
 */
export default function DevUI() {
  const [seg, setSeg] = useState<"both" | "in" | "intl">("both");
  const [radio, setRadio] = useState<"a" | "b">("a");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-[var(--w-shell)] px-4 py-10 sm:px-6">
        <h1 className="text-h1 text-ink">Primitives</h1>
        <p className="mt-2 text-body-lg text-ink-2">Every src/ui primitive, every state, light and dark.</p>

        <Row title="Button">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" icon={<ArrowRight size={16} />} iconPosition="right">With icon</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="lg">Large</Button>
        </Row>

        <Row title="IconButton">
          <IconButton label="Search" icon={<MagnifyingGlass size={16} />} />
          <IconButton label="Search" icon={<MagnifyingGlass size={16} />} variant="ghost" />
          <IconButton label="Disabled" icon={<MagnifyingGlass size={16} />} disabled />
          <Tooltip content="Search the library">
            <IconButton label="Search with tooltip" icon={<MagnifyingGlass size={16} />} />
          </Tooltip>
        </Row>

        <Row title="Chip / StatusChip">
          <Chip>Neutral chip</Chip>
          <StatusChip tone="done">Verified</StatusChip>
          <StatusChip tone="input">Needs input</StatusChip>
          <StatusChip tone="risk">Risk</StatusChip>
          <StatusChip tone="info">Info</StatusChip>
        </Row>

        <Row title="Segmented">
          <Segmented
            label="Jurisdiction"
            value={seg}
            onChange={setSeg}
            options={[
              { value: "both", label: "Both" },
              { value: "in", label: "India" },
              { value: "intl", label: "International" },
            ]}
          />
        </Row>

        <Row title="Field, TextArea">
          <Field label="Product name" placeholder="Ashwagandha extract" helper="What you call it on the label" />
          <Field label="With error" defaultValue="bad value" error="This field is required" />
          <TextArea label="Description" placeholder="Describe your product" />
        </Row>

        <Row title="RadioCards">
          <div className="w-full max-w-[480px]">
            <RadioCards
              label="Product type"
              value={radio}
              onChange={setRadio}
              options={[
                { value: "a", title: "Classical", description: "Made exactly to a First Schedule formula" },
                { value: "b", title: "New drug", description: "New ingredient, indication or route" },
              ]}
            />
          </div>
        </Row>

        <Row title="Seal">
          <Seal size={16} variant="outline" />
          <Seal size={24} variant="outline" />
          <Seal size={32} variant="filled" />
          <Seal size={48} variant="number" number={3} />
          <Seal size={32} variant="filled" animate />
        </Row>

        <Row title="CiteChip">
          <CiteChip sourceId="pa-3p" />
          <CiteChip sourceId="bda-6" num={2} />
        </Row>

        <Row title="Pips">
          <div className="w-full max-w-[280px]">
            <Pips confidence={{ auth: 3, cov: 2, agr: 1 }} />
          </div>
        </Row>

        <Row title="DiffMark">
          <span className="text-body text-ink">State Biodiversity Board intimation required<DiffMark previous="Exempt" /></span>
        </Row>

        <Row title="Callout">
          <div className="flex w-full flex-col gap-3">
            <Callout tone="note" title="Note">Background information with no action needed.</Callout>
            <Callout tone="warn" title="Needs input">Something changed and needs your attention.</Callout>
            <Callout tone="risk" title="Risk found">A prohibited claim was detected in this text.</Callout>
          </div>
        </Row>

        <Row title="EmptyState">
          <div className="w-full max-w-[360px]">
            <EmptyState message="No sources match your filters yet." action={<Button variant="secondary" size="md">Clear filters</Button>} />
          </div>
        </Row>

        <Row title="Skeleton">
          <div className="flex w-full flex-col gap-4">
            <FindingSkeleton />
            <div className="rounded-container border border-line">
              <EvidenceRowSkeleton />
              <EvidenceRowSkeleton />
            </div>
            <DataTableRowSkeleton />
          </div>
        </Row>

        <Row title="Sheet">
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open sheet</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Patents Act, 1970 Section 3(p)">
            <p className="text-body text-ink-2">Sheet content goes here.</p>
          </Sheet>
        </Row>

        <Row title="Plate">
          <div className="w-full max-w-[280px]">
            <Plate botanicalName="Withania somnifera" commonNames="Ashwagandha" />
          </div>
        </Row>

        <Row title="DataTable">
          <div className="w-full">
            <DataTable
              columns={[
                { key: "name", header: "Source", primary: true, render: (r) => r.name },
                { key: "tier", header: "Tier", render: (r) => r.tier },
              ]}
              rows={DEMO_ROWS}
              rowKey={(r) => r.id}
              emptyMessage="No sources yet."
            />
          </div>
        </Row>

        <Row title="Chapter, Section, Finding, EvidenceList (composed)">
          <div className="w-full max-w-[var(--w-main)] rounded-container border border-line">
            <Chapter n={1} titleKey="classify" purposeKey="clsLede" status={{ tone: "done", labelKey: "stateVerified" }}>
              <Section title="Findings">
                <Finding headline="Classical Ayurvedic drug" verdict={<StatusChip tone="done">Verified</StatusChip>}>
                  Made exactly to a formula in a First Schedule book.
                </Finding>
              </Section>
              <Section title="Evidence">
                <EvidenceList>
                  <EvidenceRow state="V" cites={["pa-3p"]}>Traditional knowledge cannot be patented.</EvidenceRow>
                  <EvidenceRow state="U" cites={["bda-6"]}>Registration may be required.</EvidenceRow>
                  <EvidenceRow state="C" cites={["bda-6"]}>Commentators disagree on scope.</EvidenceRow>
                  <EvidenceRow state="R">No source found yet.</EvidenceRow>
                </EvidenceList>
              </Section>
            </Chapter>
          </div>
        </Row>
      </div>
    </TooltipProvider>
  );
}
