import { generalTranslator } from "../../utils/translation/translator";
import {
  DEFAULT_CHATBOX_DIALOG_WAIT,
  DEFAULT_CHATBOX_TEXT_SPEED,
} from "../../utils/constants";
import {
  CHAT_CONTEXT,
  GOSSIP_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../../utils/translation/context";

// [{text:"", speed:30, wait:1000}]
export const GREETING = (lang) => [
  {
    text: generalTranslator(
      CHAT_CONTEXT.GREETING,
      lang,
      TRANSLATION_COLLECTION.CHAT
    ),
    speed: DEFAULT_CHATBOX_TEXT_SPEED,
    wait: DEFAULT_CHATBOX_DIALOG_WAIT,
  },
];

export const GOSSIP = (lang, lastGossipRef) => {
  // Listing all for optional speed setup
  const GOSSIPS = [
    // topic: not ai
    [{ context: GOSSIP_CONTEXT(0, 0) }, { context: GOSSIP_CONTEXT(0, 1) }],
    // topic: sketcher
    [
      { context: GOSSIP_CONTEXT(1, 0) },
      { context: GOSSIP_CONTEXT(1, 1) },
      { context: GOSSIP_CONTEXT(1, 2) },
    ],
    // topic: flash
    [
      { context: GOSSIP_CONTEXT(2, 0) },
      { context: GOSSIP_CONTEXT(2, 1) },
      { context: GOSSIP_CONTEXT(2, 2) },
    ],
    // topic: pascal
    [{ context: GOSSIP_CONTEXT(3, 0) }, { context: GOSSIP_CONTEXT(3, 1) }],
    // topic: VM
    [{ context: GOSSIP_CONTEXT(4, 0) }, { context: GOSSIP_CONTEXT(4, 1) }],
    // topic: github id
    [{ context: GOSSIP_CONTEXT(5, 0) }, { context: GOSSIP_CONTEXT(5, 1) }],
    // topic: Bach
    [
      { context: GOSSIP_CONTEXT(6, 0) },
      { context: GOSSIP_CONTEXT(6, 1) },
      { context: GOSSIP_CONTEXT(6, 2) },
    ],
    // topic: piano
    [
      { context: GOSSIP_CONTEXT(7, 0) },
      { context: GOSSIP_CONTEXT(7, 1) },
      { context: GOSSIP_CONTEXT(7, 2) },
      { context: GOSSIP_CONTEXT(7, 3) },
    ],
    // topic: fun game
    [
      { context: GOSSIP_CONTEXT(8, 0) },
      { context: GOSSIP_CONTEXT(8, 1) },
      { context: GOSSIP_CONTEXT(8, 2) },
      { context: GOSSIP_CONTEXT(8, 3) },
      { context: GOSSIP_CONTEXT(8, 4) },
    ],
    // topic: cooking
    [{ context: GOSSIP_CONTEXT(9, 0) }, { context: GOSSIP_CONTEXT(9, 1) }],
    // topic: drinking
    [{ context: GOSSIP_CONTEXT(10, 0) }],
    // topic: dumpling cake joke
    [{ context: GOSSIP_CONTEXT(11, 0) }, { context: GOSSIP_CONTEXT(11, 1) }],
    // topic: cheese cake
    [
      { context: GOSSIP_CONTEXT(12, 0) },
      { context: GOSSIP_CONTEXT(12, 1) },
      { context: GOSSIP_CONTEXT(12, 2) },
      { context: GOSSIP_CONTEXT(12, 3) },
    ],
  ];

  let id;
  do {
    id = Math.floor(Math.random() * GOSSIPS.length);
  } while (id === lastGossipRef.current);
  lastGossipRef.current = id;

  return GOSSIPS[id].map(({ context, speed, wait }) => ({
    text: generalTranslator(context, lang, TRANSLATION_COLLECTION.GOSSIP),
    speed: speed || DEFAULT_CHATBOX_TEXT_SPEED,
    wait: wait || DEFAULT_CHATBOX_DIALOG_WAIT,
  }));
};
