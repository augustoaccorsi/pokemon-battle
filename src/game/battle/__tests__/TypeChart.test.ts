import { describe, it, expect } from 'vitest';
import { getTypeEffectiveness, getCombinedEffectiveness } from '../TypeChart';

describe('getTypeEffectiveness (single type)', () => {
  it('Fire is super-effective against Grass (×2)', () => {
    expect(getTypeEffectiveness('Fire', 'Grass')).toBe(2);
  });

  it('Water is super-effective against Fire (×2)', () => {
    expect(getTypeEffectiveness('Water', 'Fire')).toBe(2);
  });

  it('Grass is super-effective against Water (×2)', () => {
    expect(getTypeEffectiveness('Grass', 'Water')).toBe(2);
  });

  it('Normal vs Ghost = ×0 (immune)', () => {
    expect(getTypeEffectiveness('Normal', 'Ghost')).toBe(0);
  });

  it('Ghost vs Normal = ×0 (immune)', () => {
    expect(getTypeEffectiveness('Ghost', 'Normal')).toBe(0);
  });

  it('Ground vs Flying = ×0 (immune)', () => {
    expect(getTypeEffectiveness('Ground', 'Flying')).toBe(0);
  });

  it('Electric vs Ground = ×0 (immune)', () => {
    expect(getTypeEffectiveness('Electric', 'Ground')).toBe(0);
  });

  it('Ghost is super-effective against Psychic (×2)', () => {
    expect(getTypeEffectiveness('Ghost', 'Psychic')).toBe(2);
  });

  it('Fire is super-effective against Ice (×2)', () => {
    expect(getTypeEffectiveness('Fire', 'Ice')).toBe(2);
  });

  it('Rock is super-effective against Fire (×2)', () => {
    expect(getTypeEffectiveness('Rock', 'Fire')).toBe(2);
  });

  it('Rock is super-effective against Flying (×2)', () => {
    expect(getTypeEffectiveness('Rock', 'Flying')).toBe(2);
  });

  it('Fire vs Water = ×0.5 (not very effective)', () => {
    expect(getTypeEffectiveness('Fire', 'Water')).toBe(0.5);
  });

  it('Normal vs Normal = ×1 (neutral)', () => {
    expect(getTypeEffectiveness('Normal', 'Normal')).toBe(1);
  });

  it('unknown attacking type returns ×1', () => {
    expect(getTypeEffectiveness('Stellar', 'Water')).toBe(1);
  });

  it('unknown defending type returns ×1', () => {
    expect(getTypeEffectiveness('Fire', 'Stellar')).toBe(1);
  });
});

describe('getCombinedEffectiveness (dual type)', () => {
  it('Rock vs Fire/Flying Pokémon = ×4 (double weakness)', () => {
    expect(getCombinedEffectiveness('Rock', ['Fire', 'Flying'])).toBe(4);
  });

  it('Electric vs Water/Flying = ×4 (double weakness)', () => {
    expect(getCombinedEffectiveness('Electric', ['Water', 'Flying'])).toBe(4);
  });

  it('Ground vs Fire/Flying = ×0 (Flying immune cancels out)', () => {
    expect(getCombinedEffectiveness('Ground', ['Fire', 'Flying'])).toBe(0);
  });

  it('Water vs Water/Grass = ×0.25 (double resistance)', () => {
    expect(getCombinedEffectiveness('Water', ['Water', 'Grass'])).toBeCloseTo(0.25);
  });

  it('Normal vs Ghost (single type) = ×0', () => {
    expect(getCombinedEffectiveness('Normal', ['Ghost'])).toBe(0);
  });

  it('single-type array matches getTypeEffectiveness result', () => {
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Ghost'];
    const defenders = ['Fire', 'Water', 'Grass', 'Ground', 'Ghost', 'Normal'];
    for (const atk of types) {
      for (const def of defenders) {
        expect(getCombinedEffectiveness(atk, [def])).toBe(getTypeEffectiveness(atk, def));
      }
    }
  });

  it('empty defender array returns ×1', () => {
    expect(getCombinedEffectiveness('Fire', [])).toBe(1);
  });
});
