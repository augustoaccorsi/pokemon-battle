"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TeamSlot from "@/components/team/TeamSlot";
import PokemonPicker from "@/components/team/PokemonPicker";
import RandomFiltersComponent from "@/components/team/RandomFilters";
import type { PokemonListItem } from "@/types";
import type { RandomFilters } from "@/types/pokemon";

const EMPTY_TEAM: (PokemonListItem | null)[] = Array(6).fill(null);

export default function TeamBuilderPage() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [team, setTeam] = useState<(PokemonListItem | null)[]>(EMPTY_TEAM);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [randomFilters, setRandomFilters] = useState<RandomFilters>({
    generations: [],
    fullyEvolved: false,
    allowLegendary: true,
  });

  const [randomLoading, setRandomLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTeamId, setSavedTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Slot interactions ─────────────────────────────────────────────────────
  const handleSlotClick = (slot: number) => {
    if (team[slot]) {
      // Filled slot: toggle selection to reveal remove button
      setSelectedSlot((prev) => (prev === slot ? null : slot));
      setPickerOpen(false);
    } else {
      // Empty slot: open picker
      setSelectedSlot(slot);
      setPickerOpen(true);
    }
  };

  const handlePickerSelect = (pokemon: PokemonListItem) => {
    if (selectedSlot === null) return;
    setTeam((prev) => {
      const next = [...prev];
      next[selectedSlot] = pokemon;
      return next;
    });
    setPickerOpen(false);
    setSelectedSlot(null);
    setError(null);
  };

  const handlePickerClose = () => {
    setPickerOpen(false);
    setSelectedSlot(null);
  };

  const handleRemove = (slot: number) => {
    setTeam((prev) => {
      const next = [...prev];
      next[slot] = null;
      return next;
    });
    setSelectedSlot(null);
    setSavedTeamId(null);
  };

  // ── Random team ───────────────────────────────────────────────────────────
  const handleRandomTeam = async () => {
    setRandomLoading(true);
    setError(null);
    setSavedTeamId(null);

    try {
      const res = await fetch("/api/teams/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generations: randomFilters.generations,
          fullyEvolved: randomFilters.fullyEvolved,
          allowLegendary: randomFilters.allowLegendary,
        }),
      });

      const data = (await res.json()) as {
        pokemon?: PokemonListItem[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get random team");
      }

      setTeam(data.pokemon ?? EMPTY_TEAM);
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRandomLoading(false);
    }
  };

  // ── Save team ─────────────────────────────────────────────────────────────
  const handleSaveTeam = async () => {
    const pokemonIds = team.filter(Boolean).map((p) => p!.id);

    if (pokemonIds.length !== 6) {
      setError("Fill all 6 slots before saving");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemonIds }),
      });

      const data = (await res.json()) as { teamId?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save team");
      }

      setSavedTeamId(data.teamId ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const isTeamFull = team.every(Boolean);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col items-center gap-6 p-6"
      style={{ background: "var(--panel-light)" }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="panel px-6 py-3 text-center"
        style={{
          fontSize: "0.75rem",
          color: "var(--text-primary)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        BUILD YOUR TEAM
      </motion.h1>

      {/* Team Grid — 3 × 2 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 w-full"
        style={{ maxWidth: 360 }}
      >
        {team.map((pokemon, i) => (
          <div key={i} className="relative">
            <TeamSlot
              pokemon={pokemon}
              slot={i}
              onClick={() => handleSlotClick(i)}
              isSelected={selectedSlot === i}
            />
            {/* Remove button visible when filled slot is selected */}
            {selectedSlot === i && pokemon && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleRemove(i)}
                aria-label={`Remove ${pokemon.name}`}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 22,
                  height: 22,
                  background: "var(--pokemon-red)",
                  border: "2px solid var(--panel-shadow)",
                  color: "#F8F0D8",
                  fontFamily: "inherit",
                  fontSize: "0.45rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                X
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleRandomTeam}
          disabled={randomLoading}
          className="battle-btn"
          style={{ fontSize: "0.6rem", padding: "10px 16px" }}
        >
          {randomLoading ? "LOADING..." : "RANDOM TEAM"}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveTeam}
          disabled={saving || !isTeamFull}
          className="battle-btn"
          style={{
            fontSize: "0.6rem",
            padding: "10px 16px",
            opacity: saving || !isTeamFull ? 0.5 : 1,
          }}
        >
          {saving ? "SAVING..." : "SAVE TEAM"}
        </motion.button>

        {isTeamFull && savedTeamId && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/battle?teamId=${savedTeamId}`)}
            className="battle-btn"
            style={{
              fontSize: "0.6rem",
              padding: "10px 16px",
              background: "var(--battle-green)",
              color: "var(--text-on-dark)",
              borderColor: "var(--panel-shadow)",
            }}
          >
            GO TO BATTLE!
          </motion.button>
        )}
      </motion.div>

      {/* Error feedback */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel px-4 py-2"
          style={{
            fontSize: "0.5rem",
            color: "var(--pokemon-red)",
            maxWidth: 360,
            textAlign: "center",
          }}
        >
          {error}
        </motion.p>
      )}

      {/* Saved team confirmation */}
      {savedTeamId && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel px-5 py-3 space-y-2"
          style={{ maxWidth: 360, width: "100%" }}
        >
          <p style={{ fontSize: "0.5rem", color: "var(--battle-green)" }}>
            TEAM SAVED!
          </p>
          <p
            style={{
              fontSize: "0.45rem",
              color: "var(--text-secondary)",
              wordBreak: "break-all",
            }}
          >
            ID: {savedTeamId}
          </p>
        </motion.div>
      )}

      {/* Random filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ width: "100%", maxWidth: 360 }}
      >
        <RandomFiltersComponent
          filters={randomFilters}
          onChange={setRandomFilters}
        />
      </motion.div>

      {/* Pokemon picker modal */}
      {pickerOpen && selectedSlot !== null && (
        <PokemonPicker
          onSelect={handlePickerSelect}
          onClose={handlePickerClose}
        />
      )}
    </main>
  );
}
