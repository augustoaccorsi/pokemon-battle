/** Shared utilities for import scripts. */

/**
 * Extracts a numeric ID from a PokéAPI URL.
 * e.g. "https://pokeapi.co/api/v2/pokemon/1/" → 1
 */
export function extractIdFromUrl(url: string): number | null {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}

/** Wait for `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a URL with automatic retry on 429 (rate limit) or network errors.
 */
export async function fetchWithRetry(
  url: string,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await sleep(1000 * (attempt + 1));
      continue;
    }

    if (response.status === 429) {
      const waitMs = (attempt + 1) * 3000;
      console.warn(`  Rate limited fetching ${url}, waiting ${waitMs}ms…`);
      await sleep(waitMs);
      continue;
    }

    return response;
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

/**
 * Process an array of items with at most `limit` concurrent async operations.
 * Each worker picks up the next item as soon as it finishes the current one.
 */
export async function withConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<void>
): Promise<void> {
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const i = index++;
      await fn(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
}
