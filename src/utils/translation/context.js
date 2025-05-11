export const GENERAL_TRANSLATE_COLLECTION = {
  TIME: 101,
};
export const TRANSLATION_COLLECTION = {
  CHAT: 201,
  GOSSIP: 202,
};

export const TIME_CONTEXT = {
  HOUR: 4,
  MINUTE: 3,
  SECOND: 2,
  SHORT_HOUR: 4.1,
  SHORT_MINUTE: 3.1,
  SHORT_SECOND: 2.1,
};

export const CHAT_CONTEXT = {
  GREETING: 101,
  LANG_SWITCH: 201,
  // skip 3*
};

export const GOSSIP_CONTEXT = (dialog, phrase) => 30000 + dialog * 100 + phrase;
