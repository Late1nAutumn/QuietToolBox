// Node visual dimensions (world units)
export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 84;

// Layout spacing
export const H_GAP = 80;
export const V_GAP = 18;
export const COL_W = NODE_WIDTH + H_GAP;
export const ROW_H = NODE_HEIGHT + V_GAP;

// Initial visible node cap. Imports/resets BFS-collapse deeper subtrees
// past this count so first paint never explodes for huge JSON.
export const INITIAL_VISIBLE_LIMIT = 50;

// Overscan (world px) for Isles' viewport virtualization
export const VIRTUALIZE_OVERSCAN = 300;

// Hard cap on the size of any relaxCollisions input. Above this, the
// pass bails out and returns its input unchanged — overlap may persist,
// but the alternative is a UI freeze (relax is O(n²) per iteration).
// Reached frequently with very large JSON; see Oak.js for the algorithm.
export const RELAX_MAX_NODES = 500;

// Default primitive values per type
export const TYPE_DEFAULTS = {
  object: {},
  array: [],
  string: '',
  number: 0,
  boolean: false,
  null: null,
};

// Sample JSON shown on first load and on Reset
export const SAMPLE_JSON = {
  name: 'Demo Project',
  version: 2,
  active: true,
  tags: ['json', 'viewer', 'isles'],
  owner: { name: 'Alice', email: 'alice@example.com' },
  items: [
    { id: 1, value: 'first' },
    { id: 2, value: 'second' },
  ],
  meta: null,
};
