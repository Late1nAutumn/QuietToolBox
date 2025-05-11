import {
  TIME_CONTEXT,
  TRANSLATION_COLLECTION,
  GENERAL_TRANSLATE_COLLECTION,
  CHAT_CONTEXT,
  GOSSIP_CONTEXT,
} from "./context.js";

const { TIME } = GENERAL_TRANSLATE_COLLECTION;
const { CHAT, GOSSIP } = TRANSLATION_COLLECTION;

export const EN_PACK = {
  [TIME]: {
    [TIME_CONTEXT.HOUR]: "hours",
    [TIME_CONTEXT.MINUTE]: "minutes",
    [TIME_CONTEXT.SECOND]: "seconds",
    [TIME_CONTEXT.SHORT_HOUR]: "hr",
    [TIME_CONTEXT.SHORT_MINUTE]: "min",
    [TIME_CONTEXT.SHORT_SECOND]: "sec",
  },
  [CHAT]: {
    [CHAT_CONTEXT.GREETING]: "Hello! Welcome to my toolbox",
    [CHAT_CONTEXT.LANG_SWITCH]: "Let's speak English",
  },
  [GOSSIP]: {
    [GOSSIP_CONTEXT(0, 0)]: "You might assume I'm an AI.",
    [GOSSIP_CONTEXT(0, 1)]: "Well, sorry. All my thoughts are preset.",

    [GOSSIP_CONTEXT(1, 0)]:
      "To paint my face out,\nmy master built a tool himself.",
    [GOSSIP_CONTEXT(1, 1)]: "You can check it out in the Sketcher app.",
    [GOSSIP_CONTEXT(1, 2)]:
      "It's basically a polygon editor\n and a color picker.",

    [GOSSIP_CONTEXT(2, 0)]:
      "I learnt Flash when I was in elementary school.\nMaking animations is very entertaining.",
    [GOSSIP_CONTEXT(2, 1)]:
      "I even got some awards from\n animation competitions.",
    [GOSSIP_CONTEXT(2, 2)]:
      "Sadly, the age of Flash is gone.\nTime changes fast.",

    [GOSSIP_CONTEXT(3, 0)]:
      "My first programming language is Pascal,\nin my middle school times.\nFor hackathons, of course,\nwon some awards",
    [GOSSIP_CONTEXT(3, 1)]:
      "Learning coding early makes it alot easier,\njust like musical instruments.",

    [GOSSIP_CONTEXT(4, 0)]: "I LOVE using virtual machines.",
    [GOSSIP_CONTEXT(4, 1)]: "Isolating environments brings huge convenience.",

    [GOSSIP_CONTEXT(5, 0)]:
      "My github handle Late in Autumn\ncomes from a song.\nUnluckily, that name has been taken already.",
    [GOSSIP_CONTEXT(5, 1)]: "That guy don't even have a single public repo!",

    [GOSSIP_CONTEXT(6, 0)]: "You should try BWV 578 and Crab Canon.",
    [GOSSIP_CONTEXT(6, 1)]:
      "Bach must be an excellent programmer if he lives in 21st centry.",
    [GOSSIP_CONTEXT(6, 2)]:
      "I also advice BWV 1042.\nI LOVE harpsichord music.",

    [GOSSIP_CONTEXT(7, 0)]:
      "I learnt piano myself.\nI was able to play one song\n after 2 years of practice",
    [GOSSIP_CONTEXT(7, 1)]:
      "But it's so hard to learn the second one. Learning instruments after grow up is a bad idea.",
    [GOSSIP_CONTEXT(7, 2)]:
      "However, I doubt I have the patience to learn it when I was a kid.",
    [GOSSIP_CONTEXT(7, 3)]: "C'est la vie",

    [GOSSIP_CONTEXT(8, 0)]:
      "My favourite game?\nI'd say Tears of the Kingdom.\nNintendo knows a good game should always be fun to play.",
    [GOSSIP_CONTEXT(8, 1)]:
      "Unlike 3A games,\nI'm sorry but,\n99% of them are trash.",
    [GOSSIP_CONTEXT(8, 2)]:
      "These producers believed producing games in Hollywood mode can bring them money.",
    [GOSSIP_CONTEXT(8, 3)]:
      "We all know they are not artists.\nThey are just boring brokers.",
    [GOSSIP_CONTEXT(8, 4)]:
      "Try out Braid, Outer Wilds,\nAnimal Well, and other indie games\nThese are the true masterpieces.",

    [GOSSIP_CONTEXT(9, 0)]: "I enjoy chopping chicken into dices.",
    [GOSSIP_CONTEXT(9, 1)]:
      "That sounds weird?\nTrust me, cooking is very relaxing.\nYou should try that if stressed out.",

    [GOSSIP_CONTEXT(10, 0)]:
      "No, I can't drink at all.\nNot even a single bottle of beer",

    [GOSSIP_CONTEXT(11, 0)]:
      "Lately I saw a photo of a brithday cake with dumplings on it.",
    [GOSSIP_CONTEXT(11, 1)]:
      "Now I know how Italians feel when seeing pineapple pizzas.",

    [GOSSIP_CONTEXT(12, 0)]: "I LOVE cheese cakes!",
    [GOSSIP_CONTEXT(12, 1)]: "But they are so damn expensive now.",
    [GOSSIP_CONTEXT(12, 2)]:
      "I remember they were $12 in costco\nwhen I first arrives USA.",
    [GOSSIP_CONTEXT(12, 3)]: "But now they are like $27.\nSo crazy.",
  },
};
