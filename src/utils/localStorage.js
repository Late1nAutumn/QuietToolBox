// ============================================================================
// localStorage wrapper for QuietToolBox
// ----------------------------------------------------------------------------
// Layout: each STORE is a single localStorage key holding ONE JSON object.
// Fields inside that object are addressed via the FIELD enum. So a write to
// `(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION, true)` mutates ONE field inside
// the JSON blob stored at key "mainStore" — it does NOT use a separate key
// per field. This keeps the key namespace tiny and migration-friendly.
//
// Stores in use:
//   - STORE.MAIN        — top-level shell state (e.g. portrait animation flag)
//   - STORE.GRAIN_BRAIN — GrainBrain app: auto-save (single atlas) + manual
//                         saves (map of name -> atlas)
//
// Returns from public API:
//   - Getters return the stored value or `null` (never throw on missing key /
//     malformed JSON — they fall back to null).
//   - Writers return `{ ok: true }` on success, or `{ ok: false, reason }` on
//     failure. The only reason currently emitted is `"quota"` for
//     QuotaExceededError. Callers SHOULD surface quota failures to the user.
//
// Schema versioning:
//   Each store JSON carries an `__version` field equal to SCHEMA_VERSION.
//   On read, a version mismatch routes the object through `migrate()` before
//   the requested field is extracted. `migrate()` is currently an identity —
//   add per-version transforms here when the on-disk shape changes.
// ============================================================================

import { AOE_VERSION } from "../GrainBrain/utils/aoe4/data";

// Schema version of the on-disk JSON. Bumping AOE_VERSION will mark all
// existing stores as outdated and route them through migrate() on next read.
const SCHEMA_VERSION = AOE_VERSION;

export const STORE = {
  MAIN: "mainStore",
  GRAIN_BRAIN: "granaryStore",
};

export const FIELD = {
  // main
  SKIP_PORTRAIT_ANIMATION: "skipPortrait",
  // granary
  AUTO_SAVE: "autoSave",
  MANUAL_SAVE: "manualSave",
};

// Add per-version transforms here. Receives the parsed store object and its
// stored version; returns the upgraded object. No-op while SCHEMA_VERSION
// stays at AOE_VERSION and no breaking changes have shipped.
const migrate = (store, obj, fromVersion) => {
  return obj;
};

const read = (store, field) => {
  let dataString = localStorage.getItem(store);
  if (!dataString) return null;
  try {
    let obj = JSON.parse(dataString);
    if (obj.__version !== SCHEMA_VERSION) {
      obj = migrate(store, obj, obj.__version);
    }
    return obj[field];
  } catch (e) {
    return null;
  }
};

// Returns `{ ok: true }` on success, or `{ ok: false, reason: "quota" }` if
// the browser rejected the write due to QuotaExceededError. Other unexpected
// errors are re-thrown so they surface during development.
const write = (store, field, value) => {
  let obj;
  try {
    let dataString = localStorage.getItem(store);
    if (!dataString) throw "inexist";
    obj = JSON.parse(dataString);
    if (typeof obj !== "object" || obj === null) throw "invalid type";
    obj[field] = value;
  } catch (e) {
    obj = { [field]: value };
  }
  obj.__version = SCHEMA_VERSION;
  try {
    localStorage.setItem(store, JSON.stringify(obj));
    return { ok: true };
  } catch (e) {
    if (e && (e.name === "QuotaExceededError" || e.code === 22)) {
      return { ok: false, reason: "quota" };
    }
    throw e;
  }
};

export const LOCALSTORAGE = {
  [STORE.MAIN]: {
    getPortraitSkipped: () =>
      read(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION) || false,
    markPortraitSkipped: () =>
      write(STORE.MAIN, FIELD.SKIP_PORTRAIT_ANIMATION, true),
  },

  [STORE.GRAIN_BRAIN]: {
    // Auto-save: single atlas, overwritten on every change. Bounded size — not
    // a realistic source of quota pressure.
    autoSave: (atlas) => write(STORE.GRAIN_BRAIN, FIELD.AUTO_SAVE, atlas),
    loadAutoSave: () => read(STORE.GRAIN_BRAIN, FIELD.AUTO_SAVE) || null,

    // Manual saves: { [name]: atlas }. Grows unbounded with user activity, so
    // saveProgress can return `{ ok: false, reason: "quota" }`. Callers must
    // handle it (see MainTools.jsx for the UX path).
    saveProgress: (atlas, savename) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || {};
      savePack[savename] = atlas;
      return write(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE, savePack);
    },
    getSaveList: () => read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || null,
    getSave: (name) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || null;
      return savePack?.[name] || null;
    },
    // Caller (ModalSaveData) only invokes this against names that came out of
    // getSaveList, so savePack is guaranteed non-null at this point.
    deleteSave: (name) => {
      let savePack = read(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE) || {};
      delete savePack[name];
      return write(STORE.GRAIN_BRAIN, FIELD.MANUAL_SAVE, savePack);
    },
  },
};
