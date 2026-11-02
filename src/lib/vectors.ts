// The hybrid search from 1surak's backend/app/kb, running in the visitor's browser.
export const DIMS = 384;
const RRF_K = 60;
const CANDIDATES = 20;
const MEANING_FLOOR = 0.3;

/** [place, topic, source, x, y, text] */
export type KbItem = [number, number, number, number, number, string];

export type Kb = {
  vectors: Int8Array;
  norms: Float32Array;
  places: Array<[string, string]>;
  sources: string[];
  items: KbItem[];
};

export function decodeVector(base64: string) {
  const bytes = atob(base64);
  const out = new Int8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes.charCodeAt(i);
  return out;
}

function norm(vector: Int8Array, start: number) {
  let sum = 0;
  for (let i = 0; i < DIMS; i++) sum += vector[start + i] ** 2;
  return Math.sqrt(sum);
}

export async function loadKb(): Promise<Kb> {
  const [binary, meta] = await Promise.all([
    fetch("/surak/kb.bin").then((r) => r.arrayBuffer()),
    fetch("/surak/kb.json").then((r) => r.json()),
  ]);
  const vectors = new Int8Array(binary);
  const norms = new Float32Array(meta.items.length);
  for (let i = 0; i < norms.length; i++) norms[i] = norm(vectors, i * DIMS);
  return { vectors, norms, places: meta.places, sources: meta.sources, items: meta.items };
}

export function passageVector(kb: Kb, id: number) {
  return kb.vectors.subarray(id * DIMS, (id + 1) * DIMS);
}

/** Cosine similarity of the query against every passage. */
export function similarities(kb: Kb, query: Int8Array) {
  const length = norm(query, 0);
  const out = new Float32Array(kb.items.length);
  for (let id = 0; id < out.length; id++) {
    const start = id * DIMS;
    let dot = 0;
    for (let i = 0; i < DIMS; i++) dot += kb.vectors[start + i] * query[i];
    out[id] = dot / (kb.norms[id] * length);
  }
  return out;
}

export function byMeaning(sims: Float32Array) {
  const ids: number[] = [];
  for (let id = 0; id < sims.length; id++) if (sims[id] >= MEANING_FLOOR) ids.push(id);
  return ids.sort((a, b) => sims[b] - sims[a] || a - b).slice(0, CANDIDATES);
}

/** Reciprocal rank fusion: near the top of both lists beats the top of one. Ties go to the earlier list. */
export function fuseRankings(...rankings: number[][]) {
  const scores = new Map<number, number>();
  const first = new Map<number, [number, number]>();
  rankings.forEach((ranking, list) => {
    ranking.forEach((id, index) => {
      const position = index + 1;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (RRF_K + position));
      if (!first.has(id)) first.set(id, [list, position]);
    });
  });
  return [...scores.keys()]
    .sort((a, b) => {
      const [listA, posA] = first.get(a)!;
      const [listB, posB] = first.get(b)!;
      return scores.get(b)! - scores.get(a)! || listA - listB || posA - posB || a - b;
    })
    .map((id) => ({ id, score: scores.get(id)! }));
}
