"use client";

import type { RandomFilters } from "@/types/pokemon";

interface RandomFiltersProps {
  filters: RandomFilters;
  onChange: (f: RandomFilters) => void;
}

const GENERATIONS = [
  { num: 1, label: "KANTO" },
  { num: 2, label: "JOHTO" },
  { num: 3, label: "HOENN" },
] as const;

export default function RandomFiltersComponent({
  filters,
  onChange,
}: RandomFiltersProps) {
  const toggleGen = (gen: number) => {
    const gens = filters.generations.includes(gen)
      ? filters.generations.filter((g) => g !== gen)
      : [...filters.generations, gen];
    onChange({ ...filters, generations: gens });
  };

  return (
    <div
      className="panel p-4 space-y-4"
      style={{ border: "2px solid var(--panel-border)" }}
    >
      <p
        style={{
          fontSize: "0.5rem",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        RANDOM FILTERS
      </p>

      {/* Generation checkboxes */}
      <div>
        <p
          style={{
            fontSize: "0.45rem",
            color: "var(--text-secondary)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}
        >
          REGION
        </p>
        <div className="flex gap-4 flex-wrap">
          {GENERATIONS.map(({ num, label }) => (
            <PixelLabel key={num}>
              <PixelCheckbox
                checked={filters.generations.includes(num)}
                onChange={() => toggleGen(num)}
                id={`gen-${num}`}
              />
              <span>{label}</span>
            </PixelLabel>
          ))}
        </div>
      </div>

      {/* Other filters */}
      <div className="flex flex-col gap-3">
        <PixelLabel>
          <PixelCheckbox
            checked={filters.fullyEvolved}
            onChange={() =>
              onChange({ ...filters, fullyEvolved: !filters.fullyEvolved })
            }
            id="fully-evolved"
          />
          <span>FULLY EVOLVED ONLY</span>
        </PixelLabel>
        <PixelLabel>
          <PixelCheckbox
            checked={filters.allowLegendary}
            onChange={() =>
              onChange({ ...filters, allowLegendary: !filters.allowLegendary })
            }
            id="allow-legendary"
          />
          <span>ALLOW LEGENDARIES</span>
        </PixelLabel>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function PixelLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="flex items-center gap-2 cursor-pointer"
      style={{ fontSize: "0.5rem", color: "var(--text-primary)" }}
    >
      {children}
    </label>
  );
}

interface PixelCheckboxProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

function PixelCheckbox({ checked, onChange, id }: PixelCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: 16,
        height: 16,
        border: "2px solid var(--panel-border)",
        background: checked ? "var(--panel-light)" : "var(--panel-light)",
        boxShadow: "1px 1px 0 var(--panel-shadow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: 0,
      }}
    >
      {checked && (
        <div
          style={{
            width: 8,
            height: 8,
            background: "var(--pokemon-red)",
            imageRendering: "pixelated",
          }}
        />
      )}
    </button>
  );
}
