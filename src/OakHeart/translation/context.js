export const TRANSLATE_COLLECTION = {
  TOOLBAR: 401,
  SIDEBAR: 402,
  NODE: 403,
  MODAL: 404,
  NOTICE: 405,
};

export const TOOLBAR_CONTEXT = {
  TITLE: 4101,
  HINT_PAN: 4102,
  HINT_ZOOM: 4103,
  HINT_DRAG: 4104,
  BUTTON_AUTO_LAYOUT: 4105,
  BUTTON_COLLAPSE_ALL: 4106,
  BUTTON_EXPAND_ALL: 4107,
  BUTTON_RESET: 4112,
  BUTTON_RESET_TIP: 4113,
  TOGGLE_TO_LIGHT: 4108,
  TOGGLE_TO_DARK: 4109,
  DRAG_WITH_CHILDREN: 4110,
  AUTO_LAYOUT_ON_EXPAND: 4111,
};

export const SIDEBAR_CONTEXT = {
  TITLE: 4201,
  STATUS_SYNCED: 4202,
  STATUS_EDITING: 4203,
  STATUS_INVALID: 4204,
  PLACEHOLDER: 4205,
  TIP_COLLAPSE: 4206,
  TIP_EXPAND: 4207,
  COUNT_TOTAL: 4208,
  COUNT_HIDDEN: 4209,
};

export const NODE_CONTEXT = {
  TIP_RENAME: 4301,
  TIP_EDIT: 4302,
  TIP_ADD: 4303,
  TIP_DELETE: 4304,
  TIP_COLLAPSE: 4305,
  TIP_EXPAND: 4306,           // caller appends " (+N)"
  TIP_LOCK: 4310,
  TIP_UNLOCK: 4311,
  PLACEHOLDER_HIDDEN: 4307,   // "hidden" — composed with "+N "
  ITEM_SINGULAR: 4308,        // "item"
  ITEM_PLURAL: 4309,          // "items"
};

export const MODAL_CONTEXT = {
  // Shared
  BUTTON_SAVE: 4401,
  BUTTON_CANCEL: 4402,
  BUTTON_DELETE: 4403,
  BUTTON_ADD: 4404,

  // Edit value
  EDIT_TITLE: 4410,
  EDIT_KEY_PREFIX: 4411,    // "Key: "
  EDIT_LABEL_TYPE: 4412,
  EDIT_LABEL_VALUE: 4413,
  EDIT_ERR_BOOLEAN: 4414,
  EDIT_ERR_NUMBER: 4415,

  // Rename key
  RENAME_TITLE: 4420,
  RENAME_LABEL: 4421,
  RENAME_ERR_EMPTY: 4422,

  // Add child — subtitle is composed as `${prefix}${parentType}${suffix}`
  // so the type word (object/array) stays in English.
  ADD_TITLE: 4430,
  ADD_PREFIX: 4431,
  ADD_OBJECT_SUFFIX: 4432,
  ADD_ARRAY_SUFFIX: 4433,
  ADD_LABEL_KEY: 4434,
  ADD_LABEL_TYPE: 4435,
  ADD_ERR_KEY: 4436,

  // Delete
  DELETE_TITLE: 4440,
  DELETE_AND: 4441,            // " and "
  DELETE_DESC_SINGULAR: 4442,  // "descendant"
  DELETE_DESC_PLURAL: 4443,    // "descendants"

  // Localized type words. Used inside modals — dropdown options,
  // "Adding to <type>" subtitles, and "<key> (<type>)" delete confirm.
  // Card badges still show the raw English type (kept consistent across
  // languages). Resolve via modalTypeContext(type) below.
  TYPE_OBJECT: 4450,
  TYPE_ARRAY: 4451,
  TYPE_STRING: 4452,
  TYPE_NUMBER: 4453,
  TYPE_BOOLEAN: 4454,
  TYPE_NULL: 4455,
};

// Transient toasts surfaced when a feature self-disables due to size or
// other guard. Rendered bottom-right of the canvas, auto-dismissed.
export const NOTICE_CONTEXT = {
  RELAX_DISABLED: 4501,
};

// Map raw type string → context key for the localized type word.
const TYPE_KEY = {
  object: MODAL_CONTEXT.TYPE_OBJECT,
  array: MODAL_CONTEXT.TYPE_ARRAY,
  string: MODAL_CONTEXT.TYPE_STRING,
  number: MODAL_CONTEXT.TYPE_NUMBER,
  boolean: MODAL_CONTEXT.TYPE_BOOLEAN,
  null: MODAL_CONTEXT.TYPE_NULL,
};
export const modalTypeContext = (type) => TYPE_KEY[type];
