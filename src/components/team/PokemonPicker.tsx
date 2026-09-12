"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PokemonListItem, PokemonType } from "@/types";
import { TypeBadge } from "@/components/ui/TypeBadge";

interface PokemonPickerProps {
  onSelect: (p: PokemonListItem) => void;
  onClose: () => void;
}

const GENERATIONS = [
  { num: 1, name: "KANTO" },
  { num: 2, name: "JOHTO" },
  { num: 3, name: "HOENN" },
  { num: 4, name: "SINNOH" },
  { num: 5, name: "UNOVA" },
  { num: 6, name: "KALOS" },
  { num: 7, name: "ALOLA" },
  { num: 8, name: "GALAR" },
] as const;

const ALL_TYPES: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel",
];

export default function PokemonPicker({
  onSelect,
  onClose,
}: PokemonPickerProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genFilter, setGenFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [results, setResults] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Fetch pokemon whenever filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (genFilter !== null) params.set("gen", String(genFilter));
    if (typeFilter !== null) params.set("type", typeFilter);

    fetch(`/api/pokemon?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { pokemon?: PokemonListItem[] }) => {
        if (!cancelled) {
          setResults(data.pokemon ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, genFilter, typeFilter]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="picker-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)" }}
      >
        <motion.div
          key="picker-panel"
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="panel flex flex-col w-full max-w-lg"
          style={{ maxHeight: "80vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="panel-dark flex items-center justify-between px-4 py-3 shrink-0"
          >
            <span style={{ fontSize: "0.6rem" }}>CHOOSE A POKEMON</span>
            <button
              type="button"
              className="battle-btn"
              style={{ fontSize: "0.5rem", padding: "4px 8px" }}
              onClick={onClose}
            >
              CLOSE
            </button>
          </div>

          {/* Search */}
          <div
            className="px-3 py-2 shrink-0"
            style={{ borderBottom: "2px solid var(--panel-border)" }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY NAME..."
              autoFocus
              style={{
                width: "100%",
                background: "var(--panel-light)",
                border: "2px solid var(--panel-border)",
                color: "var(--text-primary)",
                fontFamily: "inherit",
                fontSize: "0.55rem",
                padding: "6px 10px",
                outline: "none",
              }}
            />
          </div>

          {/* Generation tabs */}
          <div
            className="flex gap-1 px-2 py-2 overflow-x-auto shrink-0"
            style={{ borderBottom: "2px solid var(--panel-border)" }}
          >
            <GenTab
              label="ALL"
              active={genFilter === null}
              onClick={() => setGenFilter(null)}
            />
            {GENERATIONS.map((g) => (
              <GenTab
                key={g.num}
                label={`G${g.num}`}
                active={genFilter === g.num}
                onClick={() =>
                  setGenFilter(genFilter === g.num ? null : g.num)
                }
              />
            ))}
          </div>

          {/* Type filter */}
          <div
            className="flex gap-1 flex-wrap px-2 py-2 shrink-0"
            style={{ borderBottom: "2px solid var(--panel-border)" }}
          >
            <button
              type="button"
              className="battle-btn"
              style={{
                fontSize: "0.4rem",
                padding: "2px 6px",
                background:
                  typeFilter === null ? "var(--pokemon-yellow)" : undefined,
              }}
              onClick={() => setTypeFilter(null)}
            >
              ALL
            </button>
            {ALL_TYPES.map((t) => (
              <TypeBadge
                key={t}
                type={t}
                size="sm"
                selected={typeFilter === t}
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
              />
            ))}
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div
                className="flex items-center justify-center"
                style={{
                  height: 80,
                  fontSize: "0.55rem",
                  color: "var(--text-secondary)",
                }}
              >
                LOADING...
              </div>
            ) : results.length === 0 ? (
              <div
                className="flex items-center justify-center"
                style={{
                  height: 80,
                  fontSize: "0.55rem",
                  color: "var(--text-secondary)",
                }}
              >
                NO POKEMON FOUND
              </div>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2"
                      style={{
                        borderBottom: "1px solid var(--panel-border)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        background: "transparent",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--pokemon-yellow)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => onSelect(p)}
                    >
                      {p.spriteFront ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.spriteFront}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="shrink-0"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div
                          className="shrink-0 flex items-center justify-center"
                          style={{
                            width: 40,
                            height: 40,
                            fontSize: "0.5rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          ?
                        </div>
                      )}
                      <span
                        className="shrink-0"
                        style={{
                          fontSize: "0.45rem",
                          color: "var(--text-secondary)",
                          width: 32,
                        }}
                      >
                        #{String(p.id).padStart(3, "0")}
                      </span>
                      <span
                        className="flex-1 text-left uppercase truncate"
                        style={{
                          fontSize: "0.5rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {p.name}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} size="sm" />
                        ))}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Gen Tab ─────────────────────────────────────────────────────────────────── */
function GenTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="battle-btn shrink-0"
      style={{
        fontSize: "0.45rem",
        padding: "3px 8px",
        background: active ? "var(--pokemon-yellow)" : undefined,
      }}
    >
      {label}
    </button>
  );
}
