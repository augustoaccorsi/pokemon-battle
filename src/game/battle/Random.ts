/**
 * Seeded pseudo-random number generator based on a 64-bit LCG
 * (Knuth / GCC multiplier + addend, Newlib constants).
 *
 * LCG recurrence:
 *   seed = (seed x 6364136223846793005 + 1442695040888963407) mod 2^64
 *
 * Output in [0, 1):
 *   Number(seed >> 32) / 2^32
 *
 * BigInt constructor-style constants are used throughout (instead of the `n`
 * literal suffix) to stay compatible with tsconfig target ES2017 while
 * still leveraging the BigInt type available in the esnext lib.
 */
export class BattleRandom {
  private seed: bigint;

  // ─── precomputed BigInt constants ─────────────────────────────────────────

  // 2^64 (modulus)
  private static readonly MOD: bigint   = BigInt('18446744073709551616');
  // Knuth multiplicative constant
  private static readonly MUL: bigint   = BigInt('6364136223846793005');
  // Additive constant (Newlib)
  private static readonly ADD: bigint   = BigInt('1442695040888963407');
  // FNV-1a 64-bit offset basis
  private static readonly FNV_OFF: bigint = BigInt('14695981039346656037');
  // FNV-1a 64-bit prime
  private static readonly FNV_PRI: bigint = BigInt('1099511628211');
  // Shift amount for output extraction
  private static readonly SHIFT: bigint = BigInt(32);
  private static readonly ZERO: bigint  = BigInt(0);

  // ─── construction ─────────────────────────────────────────────────────────

  constructor(seed: string | number) {
    this.seed = BattleRandom.normaliseSeed(seed);
  }

  private static normaliseSeed(raw: string | number): bigint {
    const n =
      typeof raw === 'string'
        ? BattleRandom.hashString(raw)
        : BigInt(Math.trunc(raw));
    return ((n % BattleRandom.MOD) + BattleRandom.MOD) % BattleRandom.MOD;
  }

  /** FNV-1a 64-bit string hash — good distribution, no collisions for short strings. */
  private static hashString(s: string): bigint {
    let h = BattleRandom.FNV_OFF;
    for (let i = 0; i < s.length; i++) {
      h ^= BigInt(s.charCodeAt(i));
      h = (h * BattleRandom.FNV_PRI) % BattleRandom.MOD;
    }
    return h;
  }

  /** Private seed-injection factory (used by clone). */
  private static fromBigInt(seed: bigint): BattleRandom {
    const rng = new BattleRandom(0);
    rng.seed  = seed;
    return rng;
  }

  // ─── public API ────────────────────────────────────────────────────────────

  /** Advances the LCG and returns a float in [0, 1). */
  next(): number {
    this.seed =
      (this.seed * BattleRandom.MUL + BattleRandom.ADD) % BattleRandom.MOD;
    return Number(this.seed >> BattleRandom.SHIFT) / 2 ** 32;
  }

  /** Returns a random integer in [min, max] (inclusive on both ends). */
  nextInt(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /**
   * Returns true with the given probability.
   * @example rng.chance(0.25) // true ~25 % of the time
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /** Returns an independent copy with the same current seed state. */
  clone(): BattleRandom {
    return BattleRandom.fromBigInt(this.seed);
  }
}
