"use client";

import { motion } from "framer-motion";
import type { PokemonListItem } from "@/types";
import { TypeBadge } from "@/components/ui/TypeBadge";

interface TeamSlotProps {
  pokemon: PokemonListItem | null;
  slot: number;
  onClick: () => void;
  isSelected: boolean;
  level?: number;
  onLevelChange?: (level: number) => void;
}

export default function TeamSlot({
  pokemon,
  slot,
  onClick,
  isSelected,
  level = 50,
  onLevelChange,
}: TeamSlotProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      aria-label={
        pokemon
          ? `Slot ${slot + 1}: ${pokemon.name} Lv.${level}. Click to select.`
          : `Slot ${slot + 1}: empty. Click to add a Pokémon.`
      }
      style={{
        border: isSelected
          ? "2px solid var(--pokemon-yellow)"
          : pokemon
          ? "2px solid var(--panel-border)"
          : "2px dashed var(--panel-border)",
        background: "var(--panel-light)",
        boxShadow: isSelected
          ? "0 0 0 2px var(--pokemon-red), 2px 2px 0 var(--panel-shadow)"
          : "2px 2px 0 var(--panel-shadow), inset 1px 1px 0 rgba(255,255,255,0.5)",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.1s, box-shadow 0.1s",
      }}
      className="w-full h-36 flex flex-col items-center justify-center p-2 rounded-sm select-none overflow-hidden"
    >
      {pokemon ? (
        <FilledSlot
          pokemon={pokemon}
          level={level}
          isSelected={isSelected}
          onLevelChange={onLevelChange}
        />
      ) : (
        <EmptySlot slot={slot} />
      )}
    </motion.button>
  );
}

function EmptySlot({ slot }: { slot: number }) {
  return (
    <div className="flex flex-col items-center gap-1 opacity-40">
      <span
        style={{
          fontSize: "1.5rem",
          color: "var(--panel-border)",
          lineHeight: 1,
        }}
      >
        +
      </span>
      <span
        style={{
          fontSize: "0.4rem",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
        }}
      >
        SLOT {slot + 1}
      </span>
    </div>
  );
}

function FilledSlot({
  pokemon,
  level,
  isSelected,
  onLevelChange,
}: {
  pokemon: PokemonListItem;
  level: number;
  isSelected: boolean;
  onLevelChange?: (level: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      {pokemon.spriteFront ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pokemon.spriteFront}
          alt={pokemon.name}
          width={64}
          height={64}
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            fontSize: "0.5rem",
            color: "var(--text-secondary)",
          }}
        >
          ?
        </div>
      )}
      <span
        className="truncate w-full text-center"
        style={{
          fontSize: "0.45rem",
          color: "var(--text-primary)",
          textTransform: "uppercase",
        }}
      >
        {pokemon.name}
      </span>
      <div className="flex gap-0.5 flex-wrap justify-center">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>

      {/* Level badge — same height whether editable or static */}
      <div style={{ height: 20, display: "flex", alignItems: "center", marginTop: 2 }}>
        {isSelected && onLevelChange ? (
          <input
            type="number"
            min={1}
            max={100}
            value={level}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const v = Math.min(100, Math.max(1, Number(e.target.value)));
              onLevelChange(v);
            }}
            style={{
              width: 44,
              height: 18,
              fontFamily: "inherit",
              fontSize: "0.45rem",
              padding: "0 4px",
              border: "2px solid var(--pokemon-yellow)",
              background: "var(--panel-light)",
              color: "var(--text-primary)",
              textAlign: "center",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "0.4rem",
              color: "var(--text-secondary)",
              lineHeight: "18px",
            }}
          >
            Lv.{level}
          </span>
        )}
      </div>
    </div>
  );
}
